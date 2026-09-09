# PRD — Gym Workout Tracker

Product Requirements Document. Stage 1 of 5 (Project Manager).

## 1. Product Overview

A mobile-first web app for gym members to track workouts. Users manage an exercise library, build workout plans, and log real workout sessions (sets, reps, weight, volume, duration). Every finished session is stored in a history/calendar view.

- **Working title:** Gym Tracker
- **Platform:** Web app, optimized for mobile browsers
- **Primary users:** Individual gym members (single user per device in MVP)
- **Tech:** Svelte + HTML + CSS + JavaScript (SvelteKit framework)
- **MVP goal:** Minimal and functional. A polished, complete product is the end-of-stage target.

## 2. Goals & Non-Goals

### Goals
- Fast, reliable workout logging from a phone in the gym.
- Full CRUD over exercises, plans, and workouts.
- Accurate per-session records: time, exercises, sets, reps, weight, volume.
- Clear history view (calendar) with total volume and duration per session.

### Non-Goals (MVP)
- User authentication / multi-user accounts.
- Cloud database.
- Social features, coaching, nutrition tracking.
- Wearable/device integration.

These are planned for later phases (see `roadmap.md`).

## 3. Functional Requirements

### 3.1 Exercise Library
- Each exercise has: name, short description, image, tool (equipment), primary muscle, and optional secondary muscles.
- Add, edit, and delete exercises.
- Browse/search the library; filter by muscle and/or tool.

**Fields**
| Field | Required | Notes |
|---|---|---|
| name | yes | e.g. "Barbell Bench Press" |
| description | no | one-line description |
| image | no | image URL in MVP |
| tool | yes | machine / dumbbell / barbell / cable / bodyweight / bands / other |
| muscle_primary | yes | e.g. Chest |
| muscles_secondary | no | list, e.g. Triceps, Front Delts |

### 3.2 Plans
- A plan (e.g. "Bro Split", "Plan A") contains one or more workouts.
- A workout (e.g. "Leg", "Arms", "Push", "Chest") references exercises from the library, in order.
- CRUD for plans and for the workouts inside a plan.
- Add/remove/reorder exercises within a workout.

### 3.3 Start Workout (live session)
- Flow: choose Plan → choose Workout → Start.
- Session preloads the exercises defined in that workout (from the library).
- While exercising, user can:
  - log sets (weight + reps) per exercise, add/remove sets;
  - edit the exercise list (add exercises, remove ones they skip);
  - add a brand-new ad-hoc exercise that does NOT touch the library (session-only);
  - see total elapsed time (free-running rest stopwatch between sets, "Ready for next set" to continue).
- Total volume is computed live: sum of weight x reps across all sets.
- A started session persists: leaving the session screen or closing the app keeps the workout running; Home's "Start workout" button and the bottom-center nav switch to "Return to workout", and the timer continues from the stored start time.

### 3.4 End Workout → Calendar
- Pressing "End Workout" saves the session to history with all details.
- Stored header data (most important): workout name, plan name, total time, total volume.
- Also stored: start/end timestamps, each exercise with its sets (weight, reps), volume per exercise, and note if the exercise was ad-hoc (no library id).
- Calendar page shows past sessions; tapping a date shows the session summary; tapping a session shows full detail.

### 3.5 Settings
- Unit of weight: kg or lb (affects all logging and volume math).
- Weekly goal (1–7 workouts per week, default 3) — shown on Home ("Trained this week 3 / 3") and Calendar ("This week 3 / 3").
- First day of the week for the Calendar (default Saturday).
- Home layout: which stat cards show. Permanent defaults: Trained this week, Total volume this week. Optional (toggle on/off): Total workouts, Best week, Best day, Total volume this day.
- Export/import data as JSON (backup path so local data survives until cloud sync exists).

## 4. Pages & Navigation

Mobile-first with bottom navigation. Pages:

| Page | Purpose |
|---|---|
| Home | Today's summary, configurable stat cards (defaults: trained this week, volume this week), quick "Start Workout" / "Return to workout", recent sessions |
| Plans | List plans; open a plan to manage its workouts and exercises |
| Start Workout | Plan → Workout → live session screen with timer, set logging, free-running rest stopwatch |
| Calendar | History of sessions by date, week-start preference, streak + weekly-goal strip; drill into details |
| Exercises | Browse/search/filter library; add/edit/delete |
| Settings | Home layout, weekly goal, week start, unit, export/import, about |

## 5. User Stories (MVP)

1. As a member, I can add a new exercise to my library so I can use it later.
2. As a member, I can create a plan with workouts and assign exercises from my library.
3. As a member, I can pick a plan and workout, hit Start, and log sets (weight/reps) while exercising.
4. As a member, I can add or remove exercises mid-session without changing my library.
5. As a member, I can end the workout and see it saved with name, plan, time, and volume.
6. As a member, I can browse the calendar and review any past session in detail.
7. As a member, I can switch between kg and lb, and export/import my data as JSON.

## 6. Open Questions / Assumptions

Confirmed by the client:

1. **Weight unit** — default kg, configurable to lb. Not both simultaneously. (Confirmed)
2. **Exercise image** — image URL field in MVP (upload stored in cloud later). (Confirmed)
3. **Rest timer** — free-running stopwatch (counts up), "Ready for next set" to continue. (Confirmed, in MVP)
4. **Warm-up vs working sets** — not distinguished in MVP; all sets count toward volume. Can add later.
5. **Suggested weights from previous session** — nice-to-have (Phase 3, growth stage), not MVP.
6. **Offline** — localStorage means the app works offline by default in MVP.
7. **Deleting a library exercise that is referenced by a plan workout** — remove the reference from plan templates (plans are just templates; past sessions are unaffected thanks to snapshots).
8. **Stat definitions** — Trained this week = sessions this week (per week-start); Total volume this week = volume in the current week; Total workouts = all saved sessions; Best week = highest weekly volume; Best day = highest single-day volume; Volume this day = today's volume. Streak = consecutive weeks meeting the weekly goal (no max). (Confirmed)
9. **Weekly goal** — editable in Settings, default 3 workouts/week. (Confirmed)
10. **First day of week** — editable in Settings, default Saturday. (Confirmed)

## 7. Success Criteria (MVP)

- A workout can be fully logged end-to-end (plan → start → sets → end → visible in calendar).
- All CRUD operations work without page reloads and without data loss.
- App renders well on a phone screen (touch targets, bottom nav, readable forms).
- No console errors; data persists across refresh.
