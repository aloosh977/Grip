# Data Model — Gym Workout Tracker

Defines the entities, then shows two storage views: the MVP (localStorage) and the future cloud schema (Postgres/Supabase). The cloud schema is the design target; the local model mirrors it so migration is mechanical.

## 1. Entities

### Exercise
| Field | Type | Notes |
|---|---|---|
| id | string | generated uuid |
| name | string | required |
| description | string | short, optional |
| image_url | string | optional (MVP: external URL) |
| tool | string enum | machine / dumbbell / barbell / cable / bodyweight / bands / other |
| muscle_primary | string | main target, e.g. Chest |
| muscles_secondary | string[] | e.g. [Triceps, Front Delts] |
| created_at / updated_at | timestamp | |

### Plan
| Field | Type | Notes |
|---|---|---|
| id | string | uuid |
| name | string | e.g. "Bro Split" |
| description | string | optional |
| created_at / updated_at | timestamp | |

A plan contains ordered **Workout templates** (in MVP stored nested inside the plan).

### Workout (template, belongs to a Plan)
| Field | Type | Notes |
|---|---|---|
| id | string | uuid |
| plan_id | string | FK to plan |
| name | string | e.g. "Leg", "Push", "Arms" |
| sort_order | int | position within plan |
| exercises | { exercise_id, sort_order }[] | references to Exercise |

### WorkoutSession (saved history / calendar entry)
| Field | Type | Notes |
|---|---|---|
| id | string | uuid |
| plan_name | string | snapshot at time of workout |
| workout_name | string | snapshot at time of workout |
| started_at | timestamp | |
| ended_at | timestamp | |
| total_seconds | int | computed from start/end |
| total_volume | number | sum(weight * reps) over all sets |
| total_sets | int | count of all sets |
| notes | string | optional |

A session contains ordered **SessionExercise** entries.

### SessionExercise
| Field | Type | Notes |
|---|---|---|
| id | string | uuid |
| session_id | string | FK |
| exercise_id | string \| null | null when ad-hoc (added mid-session, not in library) |
| exercise_name | string | snapshot (kept even if library item is edited/deleted) |
| sets | Set[] | `{ set_number, weight, reps }` |
| volume | number | sum(weight * reps) for this exercise |

## 2. Key rules

- **Volume** = sum over all sets of `weight * reps`, in the selected unit (kg default / lb).
- **Snapshots**: sessions store plan name, workout name, and exercise names at log time. Later edits or deletes in the library must not corrupt past records.
- **Ad-hoc exercises**: during a live session, an added exercise gets `exercise_id = null` and is never written to the library.
- **Editing exercises** mid-session affects only the current session copy, never the library.
- **Week boundary**: the current week starts on `settings.week_start` (default Saturday). All "this week" stats and the calendar layout use this boundary.
- **Streak** = consecutive weeks (going backward from the current week, including it if already met) in which the number of workouts `>= settings.weekly_goal`. No maximum.
- **Home stats** (computed from `gym.sessions`): Trained this week = sessions started in the current week; Total volume this week = sum of `total_volume` for current-week sessions; Total workouts = count of all sessions; Best week = highest weekly `total_volume` sum; Best day = highest single-day `total_volume`; Volume this day = `total_volume` of sessions started today.

## 3. MVP storage (localStorage)

Keys under `gym.*`, all JSON:

```
gym.exercises      : Exercise[]
gym.plans          : Plan[]   // with workouts nested: plan.workouts[].exercises[]
gym.sessions       : WorkoutSession[]  // with session_exercises nested: session.exercises[].sets[]
gym.active_session : ActiveSession | null  // in-progress workout (persists across app restarts)
gym.settings       : { unit, weekly_goal, week_start, home_stats }
```

### `gym.settings` shape (with defaults)
```
{
  unit: "kg" | "lb",          // default "kg"
  weekly_goal: 3,             // 1..7 workouts per week, default 3
  week_start: 6,              // first day of the week, 0=Mon..6=Sun, default 6 (Saturday)
  home_stats: ["trainedWeek", "volumeWeek"],   // optional extras appended after the two defaults
  // optional extras (toggle in Settings): "totalWorkouts" | "bestWeek" | "bestDay" | "volumeDay"
}
```

### `gym.active_session` shape (in-progress workout)
```
{
  started_at: <timestamp>,           // session start; timer = now - started_at, survives reloads
  plan_name, workout_name,           // snapshots
  exercises: [ SessionExercise-like with live sets ],
  ad_hoc: [ { name, tool } ]         // session-only exercises added this session
}
```
Cleared when the workout ends (saved to `gym.sessions`) or is discarded. While present, Home's "Start workout" and the bottom-center nav show "Return to workout".

### `gym.plans` shape (nested)
```
[
  {
    id, name, description, created_at,
    workouts: [
      {
        id, name, sort_order,
        exercises: [
          { exercise_id, sort_order }
        ]
      }
    ]
  }
]
```

### `gym.sessions` shape (nested)
```
[
  {
    id, plan_name, workout_name,
    started_at, ended_at, total_seconds, total_volume, total_sets, notes,
    exercises: [
      { id, exercise_id, exercise_name, volume, sets: [ { set_number, weight, reps } ] }
    ]
  }
]
```

## 4. Cloud schema (Phase 2 — Supabase/Postgres)

Relational normalization of the same entities. Auth via Supabase Auth adds `user_id` to all tables.

```
users        (managed by Supabase Auth)
exercises    (id, user_id, name, description, image_url, tool, muscle_primary, muscles_secondary jsonb, created_at, updated_at)
plans        (id, user_id, name, description, created_at, updated_at)
plan_workouts(id, plan_id, user_id, name, sort_order)
workout_exercises (id, workout_id, exercise_id, sort_order)
workout_sessions  (id, user_id, plan_name, workout_name, started_at, ended_at, total_seconds, total_volume, total_sets, notes)
session_exercises (id, session_id, exercise_id null, exercise_name, volume, sets jsonb)
```

## 5. Migration path (local → cloud)

1. MVP already keys everything by id and stores snapshots → compatible with relational tables.
2. On first cloud login, upload local JSON via a one-time sync (map nested arrays into the normalized tables).
3. Cloud becomes source of truth; local becomes an offline cache.

## 6. Future extensions (non-MVP, noted for later phases)

- Fixed rest timer per set (the MVP rest stopwatch is session-only, no schema change).
- Suggested last weights (query recent `session_exercises` for same `exercise_id`).
- Warm-up set flag on `sets` (`is_warmup`).
- Session notes / RPE per set (`notes`, `rpe` columns).
