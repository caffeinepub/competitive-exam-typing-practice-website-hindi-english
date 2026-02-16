# Specification

## Summary
**Goal:** Build a responsive competitive-exam style typing practice website that supports English and Hindi (Devanagari), with timed tests, live stats, accurate Unicode evaluation, and optional recent results/history.

**Planned changes:**
- Create a responsive typing-test screen with passage display, typing input, countdown timer, and live metrics (WPM, accuracy, errors), plus language switching (English/Hindi) without reload.
- Implement the typing-test engine: duration selection (1/3/5/10 minutes), start/pause/reset, character-by-character comparison with correct/incorrect highlighting, and a results screen on time end.
- Add Hindi mode using Devanagari passages with Unicode-safe comparison/highlighting and an on-screen English help note explaining Hindi input via a Devanagari keyboard/IME.
- Add a small passage library for both languages and fetch random passages via backend canister methods (not only hardcoded in the UI).
- Implement a single Motoko actor backend API to: return a random passage by language; accept anonymous result submissions (language, duration, WPM/accuracy, timestamp); and provide recent results for an optional history section.
- Apply a cohesive exam-friendly visual theme/design system (no blue/purple as primary accent) across shared UI components.
- Add an optional results/history section showing recent attempts (language, duration, WPM, accuracy, timestamp/relative time) using React Query with loading/error states.

**User-visible outcome:** Users can pick English or Hindi, choose a duration, take a timed typing test with real-time accuracy/WPM feedback and per-character highlighting, see a results summary when time ends, and optionally view a recent attempts history fetched/cached via React Query.
