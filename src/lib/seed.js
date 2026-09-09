// Built-in exercise catalog. On every load the built-ins are merged into the
// user's library (missing entries only), so shipping an updated catalog never
// touches custom exercises.
//
// Demo plans/sessions are intentionally NOT seeded on first launch — the
// calendar starts empty. The `seedPlans`/`seedSessions` helpers below are kept
// for a future opt-in demo; nothing calls them yet.

import { getExercises, saveExercises, savePlans, saveSessions, uid } from './db.js';
import { computeVolume } from './stats.js';
import { toDateKey, weekStartDate, addDays, todayKey } from './utils.js';
import { DEFAULT_EXERCISES, defaultExerciseId, DEFAULT_EXERCISES_CREATED_AT } from './data/default-exercises.js';

const CHEST = [
	['Barbell Bench Press', [[60, 12], [60, 10], [65, 8], [65, 6]]],
	['Incline Dumbbell Press', [[22.5, 12], [22.5, 10], [25, 8]]],
	['Chest Press Machine', [[50, 12], [55, 10], [60, 8]]],
	['Cable Crossover', [[15, 15], [20, 12], [20, 12]]],
	['Dumbbell Chest Fly', [[12, 12], [14, 10], [14, 10]]]
];

const LEGS = [
	['Barbell Back Squat', [[60, 10], [80, 8], [90, 5]]],
	['Leg Press Machine', [[120, 12], [140, 10], [160, 8]]],
	['Leg Extension Machine', [[40, 12], [45, 12], [50, 10]]],
	['Dumbbell Walking Lunge', [[15, 12], [20, 10], [20, 10]]]
];

const POSTERIOR = [
	['Barbell Romanian Deadlift', [[60, 12], [70, 10], [80, 8]]],
	['Seated Leg Curl Machine', [[40, 12], [45, 10], [50, 8]]],
	['Barbell Hip Thrust', [[80, 10], [100, 8], [100, 6]]],
	['Seated Calf Raise Machine', [[30, 15], [35, 12], [40, 10]]]
];

const TOOL_LABELS = {
	barbell: 'Barbell',
	dumbbell: 'Dumbbell',
	cable: 'Cable',
	machine: 'Machine',
	bodyweight: 'Bodyweight',
	bands: 'Bands',
	other: 'Other'
};

function buildDefaultExercises() {
	return DEFAULT_EXERCISES.map((d) => ({
		id: defaultExerciseId(d.name),
		name: d.name,
		description: d.description,
		image_url: '',
		tool: TOOL_LABELS[d.tool] || d.tool,
		muscle_primary: d.muscle_primary,
		muscles_secondary: [...d.muscles_secondary],
		is_default: true,
		created_at: DEFAULT_EXERCISES_CREATED_AT,
		updated_at: DEFAULT_EXERCISES_CREATED_AT
	}));
}

// Merge built-ins into the user's library: add any missing defaults, never
// remove or overwrite existing exercises (custom or edited defaults).
export function ensureDefaultExercises() {
	const existing = getExercises();
	const defaults = buildDefaultExercises();
	const byId = new Map(existing.map((e) => [e.id, e]));
	let changed = false;
	for (const d of defaults) {
		if (!byId.has(d.id)) {
			existing.push(d);
			byId.set(d.id, d);
			changed = true;
		}
	}
	if (changed) saveExercises(existing);
	return existing;
}

function byName(list, name) {
	return list.find((e) => e.name === name);
}

function seedPlans(exercises) {
	const buildWorkout = (name, items) => ({
		id: uid(),
		name,
		sort_order: 0,
		exercises: items.map(([exName]) => {
			const ex = byName(exercises, exName);
			return { exercise_id: ex ? ex.id : null, sort_order: 0, sets: 3 };
		})
	});
	const plan = {
		id: uid(),
		name: 'Hypertrophy Split',
		description: 'Chest / legs / posterior split built from the default library',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		workouts: [
			buildWorkout('Chest', CHEST),
			buildWorkout('Legs', LEGS),
			buildWorkout('Posterior', POSTERIOR)
		]
	};
	savePlans([plan]);
	return plan;
}

function buildSession(date, planName, workoutName, template, exercises, minutes) {
	const started_at = date.toISOString();
	const ended_at = addDays(date, 0);
	ended_at.setSeconds(ended_at.getSeconds() + minutes * 60);
	const exs = template.map(([exName, setList], i) => {
		const lib = byName(exercises, exName);
		const sets = setList.map(([weight, reps], j) => ({
			set_number: j + 1,
			weight: String(weight),
			reps: String(reps)
		}));
		return {
			id: uid(),
			exercise_id: lib ? lib.id : null,
			exercise_name: exName,
			tool: lib ? lib.tool : '',
			volume: computeVolume(sets),
			sets
		};
	});
	return {
		id: uid(),
		plan_name: planName,
		workout_name: workoutName,
		started_at,
		ended_at: ended_at.toISOString(),
		total_seconds: minutes * 60,
		total_volume: exs.reduce((a, e) => a + e.volume, 0),
		total_sets: exs.reduce((a, e) => a + e.sets.length, 0),
		notes: '',
		exercises: exs
	};
}

function seedSessions(exercises) {
	const now = new Date();
	const ws = weekStartDate(now, 6); // default week start: Saturday
	const sessions = [];
	const planName = 'Hypertrophy Split';

	const addAt = (base, offsets, template, workoutName, minutes) => {
		for (const off of offsets) {
			const d = addDays(base, off);
			if (toDateKey(d) > todayKey()) continue; // never seed future
			sessions.push(buildSession(d, planName, workoutName, template, exercises, minutes));
		}
	};

	// 3 weeks back: 3 sessions
	addAt(addDays(ws, -21), [0, 2, 4], CHEST, 'Chest', 42);
	// 2 weeks back: 4 sessions
	addAt(addDays(ws, -14), [0, 2, 4, 5], LEGS, 'Legs', 48);
	// 1 week back: 3 sessions
	addAt(addDays(ws, -7), [0, 2, 4], POSTERIOR, 'Posterior', 45);
	// current week: up to 3 sessions, clamped to today
	addAt(ws, [0, 2, 4], CHEST, 'Chest', 44);

	saveSessions(sessions);
	return sessions;
}

// Merge built-ins into the library and nothing else. No demo plans, no seeded
// history — the calendar is empty until the user logs their first workout.
export function ensureSeed() {
	return ensureDefaultExercises();
}
