# COMPLICE — working rules

## Budget

Software cost stays at ₹0. No paid APIs, no paid hosting, no paid assets, no
subscriptions. If a step needs money, stop and find a free path.

## Where work lives

Everything stays inside this folder:
`OneDrive - THE ASHOK LEYLAND SCHOOL/linux-root/home/user/projects/complice/`
Do not write to `C:\Users\LalithReddy.b` or anywhere else.

## Secrets

- The API key lives only in `.env`, which is git-ignored.
- Never put a key in `src/`, `index.html`, `vite.config.ts`, `AGENTS.md`, or git.
- Never paste a key into chat or commit messages. Rotate any key that leaks.
- The browser talks to `/api/chat`. Only the server handler reads the key.

## The companion

COMPLICE is a friendly, curious adult AI companion. Clearly an AI. Never
romantic, flirtatious, or possessive. Short replies that read well aloud.
If someone seems to be in crisis, point them to a real person they trust.

## Accessibility

- Every control reachable by keyboard, with a visible focus ring.
- Captions announced through `aria-live`.
- `prefers-reduced-motion` fully stops companion motion, not just slows it.
- The app must work on a plain desktop browser with no headset.

## Session ritual

At the end of every work session: run `npm test` and `npm run build`, then
commit and push to the private `COMPLICE` GitHub repo.

## Stack

Vite + TypeScript + Three.js (WebXR). Tests with Vitest. Deploy target is
Vercel's free tier when there is something worth showing.
