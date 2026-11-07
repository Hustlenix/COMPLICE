# COMPLICE v0.01 — Design

- Date: 2026-11-07
- Status: awaiting approval
- Author: builder-agent, from the operator's COMPLICE product specification

## Intent

A free, browser-based mixed-reality companion demo: one fictional adult character who stands in a small room in front of you, talks with you by voice, animates while speaking, and remembers the current conversation.

This is a **portfolio and learning project**. The Meta VR Start competition requires entrants to be 18 or older, so this is not a competition entry and the design is not shaped by its deadline.

Why build it: the interesting part of a companion product is *presence*, not chat. The smallest honest proof of presence is a character who occupies a 3D room, looks at you, listens, and answers out loud. Everything else — photoreal skin, long-term memory, multiple rooms — is later.

## Goals for v0.01

1. Runs from a URL in a browser. Enters WebXR on a Quest; falls back to a desktop 3D view with mouse and keyboard for development and demo.
2. One scene: a warm, simple room.
3. One character: "COMPLICE" — an adult, fictional woman; friendly, curious, thoughtful; light playful humour; clearly an AI.
4. Conversation loop: push to talk → speech transcribed → AI reply → spoken aloud → character animates (idle, blink, listen, talk).
5. Session memory: she remembers what was said earlier in the same conversation.
6. Visible microphone state. No always-on listening.
7. Zero cost to build, run, and host at demo scale.

## Non-goals for v0.01

Photoreal avatar; phoneme-accurate lip-sync; long-term memory or persistence; hand-tracking interactions (summon, dismiss, object play); passthrough mixed reality; multiple characters or environments; native mobile app; Unity build; multiplayer; analytics.

## Anti-goals

- Romantic or dependency-forming framing. No possessiveness, guilt, exclusivity, or "don't leave" language.
- Pretending to be human. She says she is an AI when asked and does not claim to be a person.
- Always-listening microphone.
- Paid services without the operator's explicit sign-off.
- Any secret in client-side code.

## Constraints

- Free tooling and free hosting only.
- Windows development machine. Development and testing happen in a desktop browser. **Audited 2026-11-07:** Node 24.16, Python 3.13, and git 2.56 are present; Unity 6.0 and 6.5 are installed but only with Windows and WebGL modules — no Android Build Support, so Quest APKs cannot be built yet; Blender is absent; Ollama is installed but not running; the C: drive has 18 GB free of 475 GB; no Quest headset is available.
- AI provider: **Hack Club AI**, OpenAI-compatible at `https://ai.hackclub.com/proxy/v1`. Its public catalogue listed 492 models on 2026-11-07, 21 of them zero-priced, several with tool calling. The key lives only in a server-side environment variable. Hack Club's terms bar use from coding agents — that applies to the development tooling, not to the COMPLICE app itself.
- The operator is learning: the repo must stay small, readable, and runnable with two commands.

## Approaches considered

**A. Unity + Meta XR SDK** — the spec's original direction. Best character fidelity and native hand tracking, but needs Unity, the Android/Quest build pipeline, and a headset to see anything. Slowest route to a first conversation.

**B. WebXR (chosen)** — Vite + TypeScript + Three.js. Runs in the Quest Browser and in desktop Chrome; deploys free to Vercel or GitHub Pages; one codebase. Trade-off: a less photoreal character, and Quest Browser speech APIs differ from desktop.

**C. Hybrid (Unity client + web backend)** — rejected. Two codebases before a single working demo.

Chosen: **B**, with the architecture kept portable so the character assets and the backend survive a later port to Unity.

## Architecture

- **Client**: Vite + TypeScript + Three.js (WebXR). Four modules: scene, avatar, voice, UI. Deployed as a static bundle.
- **Avatar**: glTF/GLB humanoid with ARKit-compatible blendshapes. Source: a free, clearly licensed stylized-realistic asset; the builder records the source URL and license in the repo.
- **Speech in**: Web Speech API on desktop Chrome. On browsers without it (including some Quest Browser builds) the UI degrades to typed input; push-to-talk recording plus backend speech-to-text is a later milestone.
- **Speech out**: SpeechSynthesis API on desktop Chrome. Quest Browser has a known gap — `SpeechSynthesisUtterance` is unavailable — so v0.01 on Quest shows captions instead of spoken replies; voice on Quest is a later milestone using server-side TTS, and it makes true amplitude-driven jaw motion possible. Animation states: idle, listening, thinking, speaking.
- **Brain**: one serverless function (`/api/chat`) that holds the key, assembles the character sheet and safety rules, calls the provider through a small adapter, and returns text.
- **Memory**: in-page conversation history for the session, capped to a fixed number of turns. No persistence.
- **Hosting**: Vercel free tier. If unavailable, GitHub Pages for the client plus a small function host.

## Character sheet

- Name: COMPLICE (working title).
- Adult, fictional, female. Not a depiction of a real person.
- Friendly, curious, thoughtful. Light, playful humour. Expressive but respectful.
- Short turns by default: two to four sentences.
- Always transparent about being an AI. Never romantic. Never guilt-tripping. Never claims feelings for the user or asks for exclusivity. Encourages breaks and real-world friends. Keeps conversation age-appropriate.
- The full system prompt lives in one versioned file.

## First five minutes

1. The room fades in. Soft ambient sound. A "hold to talk" hint appears.
2. COMPLICE looks up from what she was doing, greets you, and says she is an AI.
3. You hold to talk and ask something. She listens, thinks, answers out loud, and keeps eye contact.
4. She asks you one question back.
5. When you go quiet she returns to her own activity and glances over when you start speaking again.

## Milestones

- **M0** — this design approved.
- **M1** — Vite + Three.js scene renders in the browser; WebXR button present; room visible.
- **M2** — Avatar loads, idles, blinks, and looks at the camera.
- **M3** — Chat loop works with typed input; character speaks with jaw animation.
- **M4** — Push-to-talk voice input; listening and talking states; ability to stop speech.
- **M5** — Personality prompt, session memory, safety rules, deployed URL, and a three-minute demo video.

Every milestone ends in something demoable.

## Risks

- **Quest Browser lacks speech recognition and speech synthesis** → typed input and captions on Quest in v0.01; server-side speech-to-text and text-to-speech later, and only if the operator accepts that cost.
- **Free avatar licensing** → only assets with clear licenses; source and license recorded in the repo.
- **Provider unknown** → one adapter function; the key never leaves the server.
- **Latency over ~2.5 s** → stream text and speak sentence by sentence.

## Calls made by the builder

- **Start gate**: desktop shows a click-to-begin screen, because browsers block audio before a user gesture. The room is visible behind it and the greeting fires after the click.
- **Deploy**: unlisted URL with a simple access code by default. Public access is a separate decision (cost caps, moderation, privacy notice).
- **Language**: English, recognizer default `en-IN` with `en-US` fallback, one configurable constant.
- **Quest voice**: desktop-first for v0.01. Quest is visual with captions and typed input, best effort. Server-side voice is a later milestone.
- **Provider**: one adapter function behind a `CHAT_PROVIDER` setting, so swapping providers touches one file.

## Open questions for the operator

1. ~~What service is the HCB key for?~~ Answered: Hack Club AI, OpenAI-compatible, free tiers confirmed.
2. Is a Quest headset available for at least one test pass? Audited: no headset present. v0.01 acceptance stays on desktop unless that changes.

## Left to the builder

Specific avatar asset; provider adapter shape; exact room art and lighting; deployment mechanics; code organization.

## Where this lives

Project root: `linux-root/home/user/projects/complice/`
This document: `docs/superpowers/specs/2026-11-07-complice-v0-01-design.md`
