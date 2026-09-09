// Live session state — persists across navigation and app restarts via storage.

import { loadActiveSession, saveActiveSession, getSessions, saveSessions, uid } from './db.js';
import { computeVolume, isSetLogged } from './stats.js';

// Object wrapper so the module-level `$state` is mutated, never reassigned (Svelte 5 rule).
export const active = $state({ value: loadActiveSession() });

export function hasActiveSession() {
	return active.value !== null;
}

export function startSession(planName, workoutName, exercises) {
	const session = {
		started_at: new Date().toISOString(),
		plan_name: planName,
		workout_name: workoutName,
		exercises: exercises.map((e, i) => ({
			id: uid(),
			exercise_id: e.exercise_id || null,
			name: e.name,
			tool: e.tool || '',
			muscle_primary: e.muscle_primary || '',
			sort_order: i,
			sets: Array.from({ length: e.defaultSets ?? 1 }, (_, j) => ({
				set_number: j + 1,
				weight: '',
				reps: ''
			}))
		}))
	};
	active.value = session;
	saveActiveSession(session);
}

function persist() {
	saveActiveSession(active.value);
}

export function addSet(exId) {
	const cur = active.value;
	if (!cur) return;
	const ex = cur.exercises.find((e) => e.id === exId);
	if (!ex) return;
	ex.sets.push({ set_number: ex.sets.length + 1, weight: '', reps: '' });
	persist();
}

export function updateSet(exId, setIndex, weight, reps) {
	const cur = active.value;
	if (!cur) return;
	const ex = cur.exercises.find((e) => e.id === exId);
	if (!ex) return;
	const set = ex.sets[setIndex];
	if (!set) return;
	set.weight = String(weight ?? '');
	set.reps = String(reps ?? '');
	persist();
}

export function removeSet(exId, setIndex) {
	const cur = active.value;
	if (!cur) return;
	const ex = cur.exercises.find((e) => e.id === exId);
	if (!ex) return;
	ex.sets.splice(setIndex, 1);
	ex.sets.forEach((s, j) => (s.set_number = j + 1));
	persist();
}

export function addAdHoc(name, tool) {
	const cur = active.value;
	if (!cur) return;
	cur.exercises.push({
		id: uid(),
		exercise_id: null,
		name,
		tool,
		muscle_primary: '',
		sort_order: cur.exercises.length,
		sets: [{ set_number: 1, weight: '', reps: '' }]
	});
	persist();
}

// Add an exercise straight from the library mid-session.
export function addLibraryExercise(ex, defaultSets = 3) {
	const cur = active.value;
	if (!cur) return;
	cur.exercises.push({
		id: uid(),
		exercise_id: ex.id,
		name: ex.name,
		tool: ex.tool || '',
		muscle_primary: ex.muscle_primary || '',
		sort_order: cur.exercises.length,
		sets: Array.from({ length: defaultSets }, (_, j) => ({ set_number: j + 1, weight: '', reps: '' }))
	});
	persist();
}

export function removeExercise(exId) {
	const cur = active.value;
	if (!cur) return;
	cur.exercises = cur.exercises.filter((e) => e.id !== exId);
	persist();
}

export function firstUnloggedSet(ex) {
	if (!ex) return null;
	const idx = ex.sets.findIndex((s) => !isSetLogged(s));
	if (idx === -1) return null;
	return { index: idx, set: ex.sets[idx] };
}

export function exerciseVolume(ex) {
	return computeVolume(ex.sets);
}

export function totalVolume() {
	const cur = active.value;
	if (!cur) return 0;
	return cur.exercises.reduce((a, e) => a + exerciseVolume(e), 0);
}

export function totalLoggedSets() {
	const cur = active.value;
	if (!cur) return 0;
	let n = 0;
	for (const e of cur.exercises) n += e.sets.filter(isSetLogged).length;
	return n;
}

// Saves the running session to history and clears the active session.
export function finishSession() {
	const cur = active.value;
	if (!cur) return null;
	const ended = new Date();
	const started = new Date(cur.started_at);
	const exercises = cur.exercises.map((e) => ({
		id: uid(),
		exercise_id: e.exercise_id,
		exercise_name: e.name,
		tool: e.tool,
		volume: exerciseVolume(e),
		sets: e.sets
			.filter(isSetLogged)
			.map((s) => ({ set_number: s.set_number, weight: s.weight, reps: s.reps }))
	}));
	const record = {
		id: uid(),
		plan_name: cur.plan_name,
		workout_name: cur.workout_name,
		started_at: cur.started_at,
		ended_at: ended.toISOString(),
		total_seconds: Math.max(0, Math.round((ended - started) / 1000)),
		total_volume: exercises.reduce((a, e) => a + e.volume, 0),
		total_sets: exercises.reduce((a, e) => a + e.sets.length, 0),
		notes: '',
		exercises
	};
	const sessions = getSessions();
	sessions.push(record);
	saveSessions(sessions);
	active.value = null;
	saveActiveSession(null);
	return record;
}

export function discardSession() {
	active.value = null;
	saveActiveSession(null);
}
