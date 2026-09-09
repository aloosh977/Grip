# Gym Tracker

A mobile-first web app for gym members to log and track workouts. Built with **Svelte** + HTML + CSS + JavaScript (SvelteKit).

## Features (MVP)
- Exercise library: add / edit / delete exercises (name, description, image, tool, target muscles)
- Plans & workouts: build plans like "Bro Split" with ordered workouts referencing library exercises
- Live workout session: choose plan → workout → log sets (weight/reps) with live total volume, edit exercises mid-session, add ad-hoc exercises (never touches the library)
- Calendar history: every ended workout is saved with plan name, workout name, duration, and volume
- Settings: kg/lb units, JSON export/import backup

## Roadmap status
- **Stage 1 — Project Manager:** complete. See `docs/PRD.md`, `docs/data-model.md`, `docs/decisions.md`, `docs/roadmap.md`.
- **Stage 2 — UI/UX:** in progress. Design system in `docs/ux/design-system.md`, persona in `docs/ux/persona.md`, interactive prototype at `design/prototype.html`, typography comparison at `design/typography-preview.html`.
- **Stage 3 — Software Engineer:** pending.
- **Stage 4 — Security Engineer:** pending.
- **Stage 5 — Growth Marketer:** pending.

> User auth and cloud storage are intentionally deferred to Phase 2 (post-MVP). The app stores data locally behind a storage abstraction so the cloud can be swapped in later without UI rework.
