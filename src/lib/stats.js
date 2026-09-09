// Volume math + derived stats. Pure functions (unit-testable).

import { toDateKey, todayKey, weekKey, addDays } from './utils.js';

// Volume of one exercise's sets = sum(weight * reps). weight/reps may be strings.
export function computeVolume(sets) {
	let total = 0;
	for (const s of sets || []) {
		const w = parseFloat(s.weight);
		const r = parseFloat(s.reps);
		if (!Number.isFinite(w) || !Number.isFinite(r)) continue;
		if (w <= 0 || r <= 0) continue;
		total += w * r;
	}
	return total;
}

export function countSets(exercises) {
	let n = 0;
	for (const ex of exercises || []) n += (ex.sets || []).filter((s) => isSetLogged(s)).length;
	return n;
}

export function isSetLogged(s) {
	const w = parseFloat(s?.weight);
	const r = parseFloat(s?.reps);
	return Number.isFinite(w) && Number.isFinite(r) && w > 0 && r > 0;
}

// The logged sets of the most recent completed session where this exercise was
// actually played — i.e. had at least one set with >0 volume (logged weight
// and reps). Sessions containing the exercise with only empty sets are
// skipped. Library exercises match by id; ad-hoc ones (no id) match by stored
// name. Searches across all history, regardless of plan/workout.
export function findLastExerciseSets(sessions, exerciseId, name) {
	if (!sessions) return null;
	const sorted = [...sessions].sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
	for (const s of sorted) {
		const hit = (s.exercises || []).find((e) =>
			exerciseId ? e.exercise_id === exerciseId : e.exercise_name === name
		);
		if (hit && (hit.sets || []).some(isSetLogged)) return hit.sets || [];
	}
	return null;
}

// Historical weight/reps for one set number, or null when that set wasn't logged.
export function lastSetValues(sets, setNumber) {
	const set = (sets || []).find((s) => s.set_number === setNumber);
	if (!set || !isSetLogged(set)) return null;
	return { weight: set.weight, reps: set.reps };
}

// Historical logged sets for every given active exercise, across all completed
// sessions. Looks for the LAST TIME each exercise was actually played — most
// recent session where it had at least one set with >0 volume (logged weight
// and reps); workouts containing it with only empty sets are skipped, so each
// exercise's history is independent of the others'. Library exercises match by
// id, ad-hoc ones (no id) by name. Sorts sessions once, so building the whole
// map is a single pass. Returns Map<localId, sets[]>; an exercise with no
// history is absent.
export function lastSetsByExercise(sessions, exercises) {
	const map = new Map();
	if (!sessions || !exercises) return map;
	const sorted = [...sessions].sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
	const wanted = exercises.map((e) => ({ id: e.id, exercise_id: e.exercise_id, name: e.name }));
	for (const s of sorted) {
		for (const ex of s.exercises || []) {
			for (const w of wanted) {
				if (map.has(w.id)) continue;
				if (w.exercise_id ? ex.exercise_id === w.exercise_id : ex.exercise_name === w.name) {
					if ((ex.sets || []).some(isSetLogged)) map.set(w.id, ex.sets || []);
				}
			}
		}
		if (map.size === wanted.length) break;
	}
	return map;
}

function weekCounts(sessions, weekStart) {
	const counts = new Map();
	for (const s of sessions) {
		const k = weekKey(new Date(s.started_at), weekStart);
		counts.set(k, (counts.get(k) || 0) + 1);
	}
	return counts;
}

function weekVolumes(sessions, weekStart) {
	const vols = new Map();
	for (const s of sessions) {
		const k = weekKey(new Date(s.started_at), weekStart);
		vols.set(k, (vols.get(k) || 0) + (s.total_volume || 0));
	}
	return vols;
}

function dayVolumes(sessions) {
	const vols = new Map();
	for (const s of sessions) {
		const k = toDateKey(new Date(s.started_at));
		vols.set(k, (vols.get(k) || 0) + (s.total_volume || 0));
	}
	return vols;
}

export function trainedThisWeek(sessions, weekStart, now = new Date()) {
	const k = weekKey(now, weekStart);
	return weekCounts(sessions, weekStart).get(k) || 0;
}

export function volumeThisWeek(sessions, weekStart, now = new Date()) {
	const k = weekKey(now, weekStart);
	return weekVolumes(sessions, weekStart).get(k) || 0;
}

export function volumeThisDay(sessions, now = new Date()) {
	const k = toDateKey(now);
	return dayVolumes(sessions).get(k) || 0;
}

export function totalWorkouts(sessions) {
	return sessions.length;
}

export function bestWeekVolume(sessions, weekStart) {
	let best = 0;
	for (const v of weekVolumes(sessions, weekStart).values()) if (v > best) best = v;
	return best;
}

export function bestDayVolume(sessions) {
	let best = 0;
	for (const v of dayVolumes(sessions).values()) if (v > best) best = v;
	return best;
}

// Consecutive weeks (ending at the current week) that met the weekly goal.
export function streakWeeks(sessions, goal, weekStart, now = new Date()) {
	const counts = weekCounts(sessions, weekStart);
	let streak = 0;
	let cursor = weekKey(now, weekStart);
	while (true) {
		const c = counts.get(cursor) || 0;
		if (c >= goal) streak++;
		else break;
		cursor = toDateKey(addDays(parseFromKey(cursor), -7));
	}
	return streak;
}

function parseFromKey(key) {
	const [y, m, d] = key.split('-').map(Number);
	return new Date(y, m - 1, d);
}

// One object with all Home stats, keyed by the stat id used in settings.home_stats.
export function allStats(sessions, settings, now = new Date()) {
	const weekStart = settings.week_start;
	return {
		trainedWeek: trainedThisWeek(sessions, weekStart, now),
		volumeWeek: volumeThisWeek(sessions, weekStart, now),
		totalWorkouts: totalWorkouts(sessions),
		bestWeek: bestWeekVolume(sessions, weekStart),
		bestDay: bestDayVolume(sessions),
		volumeDay: volumeThisDay(sessions, now),
		streak: streakWeeks(sessions, settings.weekly_goal, weekStart, now)
	};
}

// Volume per day key, for the calendar grid.
export function sessionsByDay(sessions) {
	const map = new Map();
	for (const s of sessions) {
		const k = toDateKey(new Date(s.started_at));
		if (!map.has(k)) map.set(k, []);
		map.get(k).push(s);
	}
	return map;
}
