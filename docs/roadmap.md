# Roadmap — Gym Workout Tracker (5 Stages)

Each stage has a role, deliverables, and an exit criteria. The next stage starts only when the current one's exit criteria are met.

## Stage 1 — Project Manager  (complete)
- Deliverables: this plan, `PRD.md`, `data-model.md`, `decisions.md`.
- Decisions made: SvelteKit stack; MVP = local-first with localStorage behind an abstraction; auth + cloud deferred to Phase 2; volume = sum(weight x reps).
- **Exit criteria:** PRD, data model, and decisions approved; scope for the MVP is unambiguous.

## Stage 2 — UI/UX Developer (complete)
- Deliverables: design tokens (colors, type, spacing), mobile-first wireframes for all 6 pages, component style guide, and an approved interactive HTML prototype (`design/prototype.html`) plus documented design system.
- Topics: dark gym-friendly theme, bottom navigation, big touch targets, live-session screen ergonomics (set logging, timer, focus/list modes).
- **Exit criteria:** Static prototype reviewed and approved; design system documented for stage 3.

## Stage 3 — Software Engineer  (current)
- Deliverables: full SvelteKit app — `db.js` storage layer, all pages, live workout engine, calendar, CRUD flows, JSON export/import; unit tests for volume math and session save.
- **Also shipped:** PWA/offline support — service worker precaches the app shell + static assets (`src/service-worker.js`), installable web manifest with generated icons (`static/manifest.webmanifest`, `static/icons/`), and PWA meta tags in `app.html`. The app is fully usable offline once loaded.
- **Exit criteria:** All MVP user stories pass; data survives refresh; no console errors on mobile.

## Stage 4 — Security Engineer
- Deliverables: security review of the MVP (XSS via user input, storage handling), input validation, dependency audit, HTTPS/CSP notes. First run of Phase 2: Supabase auth + cloud sync with secure patterns.
- **Exit criteria:** No high-severity findings; auth flows validated if Phase 2 is included here.

## Stage 5 — Growth Marketer
- Deliverables: onboarding flow polish, branding and naming, retention features (streaks, weekly summary, suggested weights from last session), analytics hooks, share/export story.
- **Exit criteria:** Product polished, documented, and ready for real use.

## Phase 2 (post-MVP, may start during stage 4)
- Supabase cloud DB + user login/register.
- One-time local → cloud data import.
- Cross-device sync; images become uploads.

## MVP scope snapshot
- In scope: exercise CRUD, plans/workouts, live workout logging (list + focus modes), free-running rest stopwatch, in-progress session persistence (return to workout), calendar history with streak + weekly goal, home stat cards (configurable), settings (unit, weekly goal, week start, home layout, export/import).
- Out of scope (later): auth, cloud, warm-up sets, suggested weights, social/nutrition features. (PWA/offline installability — originally out of scope — has been pulled into Stage 3 and is shipped.)
