# Grip — Design System

Stage 2 (UI/UX) deliverable. Tokens are CSS custom properties so Stage 3 (Svelte) consumes them directly.

## 1. Principles

1. **Loud visuals, quiet data** — heavy type and energy where it motivates; calm, tabular numbers where you log.
2. **One-handed, in the gym** — every tap target ≥ 48px; thumb-zone layout; readable under glare.
3. **Numbers are sacred** — tabular figures, high contrast, no decoration on data.
4. **Dark by default** — near-black base for dim gyms and energy; volt lime is the only loud color.

## 2. Color tokens

```css
:root {
  --bg: #0f0f10;          /* app background, near-black */
  --surface: #161618;     /* cards, sheets */
  --surface-2: #1d1d20;   /* raised: inputs, chips */
  --border: #2a2a2e;      /* hairline separators */
  --accent: #c6ff00;      /* volt lime — primary action, active, live timer */
  --accent-ink: #0f0f10;  /* text/icon on accent */
  --text: #f4f4f5;        /* primary text */
  --text-2: #a1a1aa;      /* secondary text, captions */
  --text-3: #6b6b72;      /* tertiary, disabled */
  --danger: #ff5c5c;      /* delete, destructive */
  --success: #4ade80;     /* done states (used sparingly) */
}
```

- **Contrast:** `--text` on `--bg` ≈ 15:1 (AA/AAA); `--accent` on `--bg` ≈ 10:1 (AAA); `--text-2` on `--bg` ≈ 7:1. All meet WCAG 2.2 AA.
- Accent is **never** used for large text on dark (use `--text`); lime is for emphasis, actions, and live values.

## 3. Typography

```css
--font-display: "Archivo Black", system-ui, sans-serif;  /* ALL CAPS display: brand, headings, numbers, buttons */
--font-body: "Inter", system-ui, sans-serif;             /* small labels, captions, descriptions */
```

| Role | Font | Size | Weight | Case |
|---|---|---|---|---|
| Brand / hero number | display | 34 / 40px | 400 (Archivo Black) | UPPERCASE |
| Screen title | display | 24px | 400 | UPPERCASE |
| Section / workout name | display | 20px | 400 | UPPERCASE |
| Live timer | display | 40px | 400 | tabular |
| Set values (kg/reps) | display | 18px | 400 | tabular |
| Body | body | 15px | 400 | sentence |
| Caption / label | body | 12px | 600 | UPPERCASE, letterspaced 0.5px |

- All numbers and timers use `font-variant-numeric: tabular-nums`.
- Heavy type is **never** used at small sizes (below 16px) — keeps data readable.
- Fonts are **self-hosted** in the app (`static/fonts/`, `@font-face`): Archivo Black + Inter. No CDN dependency.
- Icons: **lucide-svelte** set (stroke-based, recolorable), replacing the prototype's emoji glyphs.

## 4. Spacing & layout

```css
--sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-5: 20px; --sp-6: 24px; --sp-8: 32px;
--radius-sm: 10px;  /* chips, inputs */
--radius-md: 14px;  /* exercise rows */
--radius-lg: 16px;  /* cards, sheets */
--radius-xl: 24px;  /* bottom sheets, modals */
--tap-target: 48px; /* minimum */
```

- Max content width 480px (mobile-first); app centered as a column on larger screens.
- Bottom navigation bar, 64px tall, always visible: Home · Plans · Start · Calendar · Exercises.
- Thumb zone: primary actions sit in the lower half; destructive actions in menus/sheets.

## 5. Components

| Component | Spec |
|---|---|
| Button primary | volt lime bg, accent-ink text, Archivo Black 16px, full width, 52px tall, radius md |
| Button ghost | transparent, 1px border `--border`, text color, 52px |
| Set chip | surface-2 bg, radius sm, value in Archivo Black tabular, label in Inter caption |
| Exercise row | surface bg, radius md, name in display 20px + caption meta; chevron / add |
| Sheet (bottom) | radius-xl top corners, surface bg, drag handle, used for add/edit forms |
| Input | surface-2 bg, border on focus accent, 52px tall |
| Segment toggle | pill container; active segment volt lime, inactive text-2 |
| Live timer | display 40px tabular, accent when running |
| Rest timer | full-screen overlay: free-running stopwatch counting up, "READY FOR NEXT SET" primary button |

## 6. Screens (mobile-first)

1. **Home** — greeting, big "START WORKOUT" primary button (switches to "RETURN TO WORKOUT" while a session is running), configurable stat cards (defaults: trained this week `3 / 4`, total volume this week; optional: total workouts, best week, best day, volume this day — toggled in Settings), recent sessions + calendar link. Gear icon top-right → Settings.
2. **Plans** — plan cards; plan detail lists its workouts; workout detail lists exercises (reorder/edit).
3. **Start Workout** — pick plan → pick workout → live session:
   - Top: total timer + workout/plan name. Timer runs from the stored start time, so it keeps counting across navigation and app restarts; the Home button and bottom-center FAB become "Return to workout".
   - **List mode:** all exercises, one row per exercise with set chips; tap a set to edit.
   - **Focus mode:** current set only — set number, start time, giant FINISH button; after finish, reps/weight entry; then a free-running rest stopwatch; "READY FOR NEXT SET" closes it and starts the next set. Delete-set control. Toggle back to list anytime.
   - Ad-hoc exercise: "ADD EXERCISE" (session-only, never library).
4. **Calendar** — week-start day configurable (default Saturday). Top strip shows streak (weeks in a row) and this-week progress vs weekly goal (`3 / 4`). Month grid, each day shows total volume; tap day → session(s); tap session → full detail (name, plan, duration, volume, per-exercise sets).
5. **Exercises** — search + filter chips (tool / muscle); list; add/edit/delete via sheet; delete removes from plan templates (snapshot rule).
6. **Settings** — Home layout (stat card toggles), weekly goal (1–7, default 4), week starts on (default Saturday), unit (kg/lb segment), export/import JSON, about.

## 7. Motion (kept minimal — energy without noise)

- Screens fade/slide 150–200ms ease-out.
- Buttons press scale 0.98, not bouncy.
- Live timer and volume tick update instantly, no animation (numbers stay quiet).
- Rest-timer end: single accent flash, no sound in MVP.
