# COMPLICE Phase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A running browser-based COMPLICE scene: a warm room, a stylized companion, a start gate, and the app architecture the AI and voice phases plug into.

**Architecture:** Vite + TypeScript + Three.js, rendered in the desktop browser and entering WebXR on a headset. A small state machine drives the companion's behaviour; the room and avatar are isolated modules; the chat endpoint is a serverless stub that never holds a key in client code.

**Tech Stack:** Vite, TypeScript, Three.js (WebXR), Vitest.

**Spec:** `docs/superpowers/specs/2026-11-07-complice-v0-01-design.md`

## Global Constraints

- Software budget: ₹0. No paid services, no paid assets, no paid hosting.
- All work stays inside `linux-root/home/user/projects/complice/`.
- Secrets live only in `.env`; `.env` is git-ignored. No key in client code or the repo.
- The companion is a friendly, non-romantic, clearly-AI adult character.
- Every screen must work on desktop without a headset.
- Accessibility: keyboard reachable controls, visible focus, `aria-live` captions, `prefers-reduced-motion` respected.

## Review Focus

- First load in a plain desktop browser with no WebXR support — the scene must still render and be navigable.
- Clicking Enter twice, or leaving the gate open — no duplicate loops or stuck states.
- Resizing the window and exiting an XR session — canvas must return to the right size.
- Missing `HACKCLUB_API_KEY` — the chat endpoint must fail with a clear 501, never a crash.
- Reduced-motion preference — the companion must stay still, not merely slow down.

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `.env.example`
- Test: build succeeds

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm test`

- [ ] **Step 1:** Create the Vite/TypeScript project files.
- [ ] **Step 2:** Run `npm install` and confirm it completes.
- [ ] **Step 3:** Run `npm run build`; expect a `dist/` bundle with no TypeScript errors.
- [ ] **Step 4:** Commit the scaffold.

### Task 2: App state machine

**Files:**
- Create: `src/state/appState.ts`
- Test: `src/state/appState.test.ts`

**Interfaces:**
- Produces: `type CompanionState = 'idle' | 'listening' | 'thinking' | 'speaking'`; `createStateMachine(initial?: CompanionState)` with `get()`, `can(next)`, `transition(next)`, `subscribe(fn)`.

- [ ] **Step 1:** Write failing tests for the valid cycle `idle → listening → thinking → speaking → idle`, invalid `idle → speaking` throwing, and unsubscribe stopping notifications.
- [ ] **Step 2:** Run `npm test`; expect failure because the module does not exist.
- [ ] **Step 3:** Implement `createStateMachine` with the allowed-transition table.
- [ ] **Step 4:** Run `npm test`; expect all tests to pass.

### Task 3: Room scene and WebXR entry

**Files:**
- Create: `src/scene/room.ts`, `src/main.ts`

**Interfaces:**
- Consumes: Three.js.
- Produces: `buildRoom(scene: THREE.Scene): void`; a running render loop with `renderer.xr` enabled and a VRButton.

- [ ] **Step 1:** Build the room module: floor, three walls, rug, desk, warm lamp light, window glow.
- [ ] **Step 2:** Wire `main.ts`: renderer, camera at eye height, resize handler, animation loop, VRButton, OrbitControls for desktop.
- [ ] **Step 3:** Run `npm run build`; expect success.
- [ ] **Step 4:** Load in the browser and confirm the room renders without console errors.

### Task 4: Placeholder companion

**Files:**
- Create: `src/avatar/companion.ts`
- Modify: `src/main.ts`

**Interfaces:**
- Produces: `buildCompanion(): { group: THREE.Group; update(time: number, state: CompanionState, reducedMotion: boolean): void }`.

- [ ] **Step 1:** Build a stylized adult figure from primitives with idle breathing, periodic blinking, listening head-tilt, and speaking nod.
- [ ] **Step 2:** Add her to the scene at the room centre, facing the camera.
- [ ] **Step 3:** Run `npm run build`; expect success.
- [ ] **Step 4:** Confirm in the browser that she idles and looks at the camera.

### Task 5: UI overlay

**Files:**
- Create: `src/ui/overlay.ts`, `src/styles.css`
- Modify: `index.html`, `src/main.ts`

**Interfaces:**
- Produces: `bindOverlay(machine: StateMachine): void`; `setCaption(text: string): void`; `setStatus(state: CompanionState): void`.

- [ ] **Step 1:** Add the start gate, title, status pill, caption region (`aria-live="polite"`), and a "voice coming next" hint.
- [ ] **Step 2:** Wire the Enter button to hide the gate, focus the scene, and drive the state machine through a short greeting sequence.
- [ ] **Step 3:** Add visible focus styles and a reduced-motion rule.
- [ ] **Step 4:** Run `npm run build`; expect success.

### Task 6: Chat endpoint stub

**Files:**
- Create: `api/chat.ts`, `.env.example`
- Modify: `README.md`

**Interfaces:**
- Produces: `POST /api/chat` accepting `{ messages: { role, content }[] }`, returning the provider response or a 501 when `HACKCLUB_API_KEY` is unset.

- [ ] **Step 1:** Implement the handler with method check, body validation, key guard, and an upstream call to `${HACKCLUB_BASE_URL}/chat/completions`.
- [ ] **Step 2:** Confirm no secret appears in `src/` (grep) and `.env` is ignored.
- [ ] **Step 3:** Run `npm run build`; expect success.

### Task 7: Repository

**Files:**
- Create: `AGENTS.md`, `README.md`
- Modify: `.gitignore`

- [ ] **Step 1:** Write project rules: ₹0 budget, stay in the project folder, secrets in `.env`, commit and push every session.
- [ ] **Step 2:** Initialise git inside the project, stage, and commit.
- [ ] **Step 3:** When GitHub authentication is available: create the private `COMPLICE` repo and push.
