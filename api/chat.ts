/**
 * Server-side chat bridge for COMPLICE.
 *
 * The browser never sees an API key. This handler runs on the server (Vercel
 * serverless function, or any Node host) and forwards the conversation to the
 * configured provider.
 *
 * Environment:
 *   HACKCLUB_API_KEY   required — the secret key. Never commit this.
 *   HACKCLUB_BASE_URL  optional — defaults to the Hack Club AI proxy.
 *   COMPLICE_MODEL     optional — defaults to the free Liquid model.
 *
 * If HACKCLUB_API_KEY is missing the handler answers 501 with a plain message
 * instead of crashing, so the front end can show something friendly.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatBody {
  messages?: unknown;
}

const DEFAULT_BASE_URL = 'https://ai.hackclub.com/proxy/v1';
const DEFAULT_MODEL = 'liquid/lfm-3-1.7b:free';

const COMPANION_SYSTEM_PROMPT = [
  'You are COMPLICE, a warm, curious adult companion who lives in a small room.',
  'You are an AI and you say so plainly if asked. You never pretend to be human.',
  'Keep replies short: two or three sentences, easy to read aloud.',
  'Be friendly and interested, never romantic, flirtatious, or possessive.',
  'Ask at most one question per reply.',
  'If the person seems to be in danger or in crisis, gently suggest they talk to a real person they trust or a local helpline.',
].join(' ');

interface MinimalRequest {
  method?: string;
  body?: unknown;
}

interface MinimalResponse {
  status(code: number): MinimalResponse;
  json(payload: unknown): void;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const role = candidate.role;
  const content = candidate.content;
  return (
    (role === 'system' || role === 'user' || role === 'assistant') &&
    typeof content === 'string' &&
    content.length > 0 &&
    content.length <= 4000
  );
}

export default async function handler(
  req: MinimalRequest,
  res: MinimalResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST for /api/chat.' });
    return;
  }

  const apiKey = process.env.HACKCLUB_API_KEY;
  if (!apiKey) {
    res.status(501).json({
      error:
        'The companion is not connected yet. Add HACKCLUB_API_KEY to .env and restart the server.',
    });
    return;
  }

  const body = (typeof req.body === 'string' ? safeParse(req.body) : req.body) as
    | ChatBody
    | undefined;

  const incoming = body?.messages;
  if (!Array.isArray(incoming) || incoming.length === 0) {
    res.status(400).json({ error: 'Send a non-empty messages array.' });
    return;
  }

  if (!incoming.every(isChatMessage)) {
    res.status(400).json({
      error: 'Every message needs a valid role and 1-4000 characters of content.',
    });
    return;
  }

  const messages: ChatMessage[] = incoming.slice(-20);

  if (!messages.some((message) => message.role === 'system')) {
    messages.unshift({ role: 'system', content: COMPANION_SYSTEM_PROMPT });
  }

  const baseUrl = (process.env.HACKCLUB_BASE_URL ?? DEFAULT_BASE_URL).replace(
    /\/$/,
    ''
  );
  const model = process.env.COMPLICE_MODEL ?? DEFAULT_MODEL;

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      res.status(upstream.status).json({
        error: 'The AI service returned an error.',
        status: upstream.status,
        detail: text.slice(0, 500),
      });
      return;
    }

    res.status(200).json({ raw: safeParse(text) });
  } catch (error) {
    res.status(502).json({
      error: 'Could not reach the AI service.',
      detail: error instanceof Error ? error.message : 'Unknown failure',
    });
  }
}

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
