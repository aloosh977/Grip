# AGENTS.md — Gym Workout Tracker (Grip)

## Development Commands
- Install: npm install
- Dev server: npm run dev
- Build: npm run build
- Preview build: npm run preview
- Unit tests: npm run test (runs Vitest once)

## Architecture & Toolchain Quirks
- **Framework:** SvelteKit + Svelte 5 (runes mode forced via Vite plugin configuration).
- **Client-Side SPA:** ssr = false and prerender = false in src/routes/+layout.js. Static output via @sveltejs/adapter-static with fallback 200.html.
- **Storage Layer:** All data reads/writes go through src/lib/db.js using localStorage for MVP. Do not access localStorage directly in UI components.
- **Active Sessions:** Persisted across page reloads/navigation via src/lib/sessionStore.svelte.js (module-level $state wrapping localStorage).
- **Snapshots & Ad-hoc Exercises:** Workout sessions save snapshot copies of exercise names/plans so library updates do not alter historical workout records. Ad-hoc exercises added mid-session have exercise_id = null and never touch the library.
- **Browser Baseline:** Modern evergreen browsers only (relies on CSS dvh, custom properties, optional chaining).
