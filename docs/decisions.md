# Decision Log — Gym Workout Tracker

Architecture and scope decisions, with rationale. Stage 1 (Project Manager).

## D1. Framework: SvelteKit (Svelte + HTML + CSS + JavaScript)

- **Decision:** Build with SvelteKit, using Svelte + HTML + CSS + vanilla JavaScript. No React, no TypeScript unless a later stage argues for it.
- **Why:** User requirement (Svelte). SvelteKit adds routing, layouts, and SSR/static build on top of Svelte with minimal ceremony.
- **MVP output:** static, client-side app (adapter-static) — fast, no server needed.
- **Impact:** All stages write Svelte components and plain JS modules.

## D2. MVP storage: localStorage, behind a storage abstraction

- **Decision:** All data reads/writes go through a single storage module (`src/lib/db.js` — getters/setters like `getExercises`, `savePlan`, `createSession`). MVP implementation uses localStorage.
- **Why:** Fastest path to a working app; no backend; offline by default. The abstraction makes the Phase 2 cloud swap a drop-in change (UI never touches storage directly).
- **Constraint:** localStorage ~5MB. Fine for text data; images stay as external URLs in MVP, so this is acceptable. Revisit with IndexedDB if images become uploads.

## D3. Auth + cloud database: NOT in MVP (Phase 2) — CONFIRMED

- **Decision:** User login/register and a cloud database ship in Phase 2, after the MVP works. Confirmed by client.
- **Why:** Keeps the MVP minimal and functional (user's stated priority); avoids backend/auth complexity during stage 3. Cloud can be added later without rework because of D2 and because the data model is already cloud-shaped (see `data-model.md`).
- **Phase 2 plan:** Supabase (free tier) for Postgres + built-in auth + JS SDK. One-time import of the local JSON on first login.
- **Safety net in MVP:** JSON export/import in Settings.

## D4. Weight units — CONFIRMED

- **Decision:** Single unit globally, **default kg**, switchable to lb in Settings. All volume math uses the selected unit.
- **Why:** Simplicity. Dual-unit is complexity not needed in MVP.

## D5. Images — CONFIRMED

- **Decision:** Exercise images are URLs in MVP (paste/type an image link). No file upload, no base64 blobs.
- **Why:** Avoids localStorage size problems and upload plumbing. File upload becomes possible with cloud storage in Phase 2.

## D8. Deleting a referenced exercise

- **Decision:** Deleting a library exercise removes its references from plan workout templates. Past sessions are never modified (snapshot rule, D7).
- **Why:** Plans are templates; dangling references would break the start-workout flow. Historical accuracy is preserved by snapshots.

## D6. Ad-hoc exercises never touch the library

- **Decision:** Exercises added mid-session are stored with `exercise_id = null` and the snapshot name. Library stays untouched by live sessions.
- **Why:** User requirement; also keeps library curated and sessions accurate.

## D7. Sessions store snapshots, not references

- **Decision:** Plan name, workout name, and exercise names are copied into the session record at save time.
- **Why:** Editing or deleting library items later must not corrupt historical workouts.

## D9. In-progress sessions persist across navigation and app restarts (CONFIRMED)

- **Decision:** A started workout stays active when the user leaves the session screen or closes the app. Home's "Start workout" button and the bottom-center FAB become "Return to workout"; the session timer keeps counting from the stored start timestamp.
- **Why:** User requirement — a gym session spans the whole visit; users check other screens (e.g., calendar, exercises) between sets and want the workout to keep running in the background.
- **Implementation:** Persist `started_at` (plus session snapshot) to storage when the session begins. Timer = `now − started_at`, so it survives page reloads and app restarts without a background process.

## D10. Rest timer is a free-running stopwatch, not a countdown (CONFIRMED)

- **Decision:** After saving a set, a rest overlay opens with a timer that counts up from 00:00. The user rests as long as they need and presses **Ready for next set** to close it.
- **Why:** User requirement — fixed rest durations don't match real training tempo; the user decides when to start the next set.

## D11. Home stat layout is user-configurable; defaults are fixed (CONFIRMED)

- **Decision:** The Home dashboard under "Start workout" shows stat cards. Two are permanent defaults: **Trained this week** (e.g. `3 / 4`) and **Total volume this week**. Additional cards can be toggled on in Settings: **Total workouts**, **Best week**, **Best day**, **Total volume this day**. The set of options is locked to what we implement (extensible later).
- **Why:** User requirement — shows weekly progress at a glance, with personalization without over-building.

## D12. Weekly goal + first day of week are user settings (CONFIRMED)

- **Decision:** Settings expose a **weekly goal** (1–7 workouts per week, **default 3**) shown on Home ("Trained this week 3 / 3") and Calendar ("This week 3 / 3"), and a **first day of week** preference (default **Saturday**) that drives the Calendar week layout.
- **Why:** User requirement — "Trained this week" is meaningless without a goal and a defined week boundary.

## D14. Home stat + streak definitions (CONFIRMED)

- **Decision:** Trained this week = sessions in the current week (per week-start). Total volume this week = current-week volume. Total workouts = all saved sessions. Best week = highest weekly volume. Best day = highest single-day volume. Volume this day = today's volume. **Streak = consecutive weeks meeting the weekly goal** (e.g. goal 3 → weeks with ≥3 workouts), no maximum.
- **Why:** User requirement — a stricter, goal-based streak than "trained at all" is more motivating for a beginner with a set weekly target.

## D15. Stage-3 stack specifics (CONFIRMED)

- **Decision:**
  - Routing: real SvelteKit routes per screen (`/`, `/plans`, `/start`, `/calendar`, `/exercises`, `/settings`, `/session`), not a single tab shell.
  - Tests: Vitest (SvelteKit standard) — unit tests for volume math and session save per roadmap.
  - Icons: **lucide-svelte** in the MVP; custom SVG files later in the finished product if wanted.
  - Fonts: **self-hosted** (Archivo Black + Inter `woff2` in `static/fonts/`, `@font-face`) — offline-friendly and no dependency on Google's CDN.
  - PWA/offline installability: **implemented** — SvelteKit's built-in `$service-worker` module (`src/service-worker.js`), hand-authored `manifest.webmanifest`, and generated PNG icons (see `scripts/gen-icons.mjs`). No `vite-plugin-pwa` dependency, because Vite 8 has no released addon/plugin support yet and the SvelteKit-native approach covers the need.
- **Why:** Real routes match the design's screen structure; lucide-svelte gives consistent, recolorable icons with zero design work; self-hosting supports the offline story.

## D13. Settings/gear entry point: top-right of Home only (CONFIRMED)

- **Decision:** A gear icon sits in the top-right of the Home screen only. Settings is reached from there. No profile entry point in MVP (no accounts).
- **Why:** User preference; matches iOS HIG (top-right for configuration) and keeps the bottom nav focused on primary destinations. Secondary screens already have their own top bars with back + contextual actions.

## D16. Supported browser baseline: modern evergreen browsers (CONFIRMED)

- **Decision:** The app targets modern, evergreen browsers — effectively the latest 2 major versions of Chrome/Edge, Firefox, and Safari (iOS 16+/Android 7+). No ES5 transpilation or legacy-CSS fallbacks.
- **Why:** The stack relies on features that old browsers lack: CSS custom properties (`var(--…)`, Chrome 49+), flexbox `gap` (84+), `dvh` viewport units (108+), the `inset` shorthand (87+), and modern JS syntax like optional chaining `?.` / nullish `??` (80+). On Android 6 (Chrome ~44 / 2015 WebView) these are unsupported, so the app renders broken or fails to load; the same build is perfect on Android 11. Adding fallbacks for a 2015 engine would mean dropping these features for everyone.
- **Impact:** Screen-size-independent — an Android 6 phone with a large screen fails exactly like a small one. Documented so testers don't file "broken on old phone" as bugs.

## Open questions (defaults listed in `PRD.md` section 6)

- Warm-up sets (out of MVP), suggested weights from last session (Phase 3), unit (default kg).
