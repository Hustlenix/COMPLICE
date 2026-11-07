# COMPLICE

A browser-first AI companion who lives in a small room. She is an AI, and she
says so. Works on a normal desktop browser; enters VR on a headset browser when
one is available.

This is a portfolio and learning project. It costs ₹0 in software.

## Status

Phase 1 — foundation. The room renders, the companion idles and reacts to
state, and the chat endpoint is wired but disconnected until a key is added.

## Run it locally

```bash
npm install
npm run dev
```

Then open the address it prints (usually `http://localhost:5173`).

## Connect the AI

1. Copy `.env.example` to `.env`.
2. Put your own key in `.env` as `HACKCLUB_API_KEY=...`.
3. Restart the dev server.

Without a key the chat endpoint answers with a clear "not connected yet"
message instead of failing silently. Keys are never shipped to the browser and
never committed.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Type-check, then produce a production bundle in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the unit tests |

## Layout

```
api/chat.ts          server-side chat bridge (holds the key)
src/main.ts          renderer, camera, loop, start sequence
src/scene/room.ts    the room
src/avatar/companion.ts  the companion figure and her motion
src/state/           conversation state machine + tests
src/ui/overlay.ts    start gate, status pill, captions
src/styles.css       all styling
docs/                design doc and phase plans
```

## Accessibility commitments

Keyboard reachable controls with visible focus, captions in an `aria-live`
region, and a `prefers-reduced-motion` mode that stops the companion's motion
completely.

## Roadmap

1. Phase 0 — environment audit (done)
2. Phase 1 — project foundation (this)
3. Phase 2 — AI conversation
4. Phase 3 — companion simulator
5. Phase 4 — voice and memory
6. Phase 5 — VR integration
