import { describe, it, expect } from 'vitest';
import { computeVolume, trainedThisWeek, streakWeeks, allStats, findLastExerciseSets, lastSetsByExercise, lastSetValues } from './stats.js';

describe('computeVolume', () => {
	it('sums weight * reps for numeric sets', () => {
		expect(computeVolume([{ weight: 60, reps: 10 }, { weight: 60, reps: 10 }])).toBe(1200);
	});

	it('parses string values', () => {
		expect(computeVolume([{ weight: '22.5', reps: '12' }])).toBe(270);
	});

	it('skips empty, zero, or invalid sets', () => {
		expect(
			computeVolume([
				{ weight: '', reps: '' },
				{ weight: 60, reps: 10 },
				{ weight: 0, reps: 10 },
				{ weight: 60, reps: 'x' },
				{ weight: 60, reps: -5 }
			])
		).toBe(600);
	});

	it('returns 0 for empty sets', () => {
		expect(computeVolume([])).toBe(0);
	});
});

describe('week stats (week starts Saturday, index 6)', () => {
	const now = new Date('2026-08-19T12:00:00'); // Wednesday
	const mk = (iso) => ({ started_at: new Date(`${iso}T08:00:00`).toISOString(), total_volume: 1000 });

	it('trainedThisWeek counts sessions in the current week', () => {
		const sessions = [mk('2026-08-15'), mk('2026-08-17'), mk('2026-08-19'), mk('2026-08-08')];
		expect(trainedThisWeek(sessions, 6, now)).toBe(3);
	});

	it('streak counts consecutive weeks meeting the goal', () => {
		const sessions = [
			mk('2026-08-15'), mk('2026-08-17'), mk('2026-08-19'), // this week: 3
			mk('2026-08-08'), mk('2026-08-10'), mk('2026-08-12'), // last week: 3
			mk('2026-08-01'), mk('2026-08-03'), mk('2026-08-05') // two weeks ago: 3
		];
		expect(streakWeeks(sessions, 3, 6, now)).toBe(3);
	});

	it('streak breaks when a week misses the goal', () => {
		const sessions = [
			mk('2026-08-15'), mk('2026-08-17'), mk('2026-08-19'), // this week: 3
			mk('2026-08-08'), mk('2026-08-10') // last week: 2 < goal
		];
		expect(streakWeeks(sessions, 3, 6, now)).toBe(1);
	});

	it('streak is 0 when the current week has not met the goal', () => {
		const sessions = [mk('2026-08-15'), mk('2026-08-17')]; // this week: 2
		expect(streakWeeks(sessions, 3, 6, now)).toBe(0);
	});

	it('allStats aggregates the home stat set', () => {
		const sessions = [mk('2026-08-15'), mk('2026-08-17'), mk('2026-08-19')];
		const stats = allStats(sessions, { week_start: 6, weekly_goal: 3 }, now);
		expect(stats.trainedWeek).toBe(3);
		expect(stats.volumeWeek).toBe(3000);
		expect(stats.totalWorkouts).toBe(3);
		expect(stats.bestDay).toBe(1000);
		expect(stats.bestWeek).toBe(3000);
		expect(stats.volumeDay).toBe(1000);
	});
});

describe('history lookup', () => {
	const mkSession = (iso, exercises) => ({
		started_at: new Date(`${iso}T08:00:00`).toISOString(),
		exercises
	});
	const bench = (sets) => ({
		exercise_id: 'e1',
		exercise_name: 'Bench',
		tool: 'Barbell',
		volume: 0,
		sets
	});
	const adhoc = (sets) => ({
		exercise_id: null,
		exercise_name: 'Landmine Press',
		tool: 'Dumbbell',
		volume: 0,
		sets
	});
	const squat = (sets) => ({
		exercise_id: 'e2',
		exercise_name: 'Squat',
		tool: 'Barbell',
		volume: 0,
		sets
	});

	it('finds the most recent session containing the exercise', () => {
		const sessions = [
			mkSession('2026-08-10', [bench([{ set_number: 1, weight: '50', reps: '10' }])]),
			mkSession('2026-08-15', [bench([{ set_number: 1, weight: '60', reps: '12' }])]),
			mkSession('2026-08-18', [bench([{ set_number: 1, weight: '65', reps: '10' }])])
		];
		const sets = findLastExerciseSets(sessions, 'e1', 'Bench');
		expect(sets).toEqual([{ set_number: 1, weight: '65', reps: '10' }]);
	});

	it('skips sessions that do not contain the exercise', () => {
		const sessions = [
			mkSession('2026-08-18', [adhoc([{ set_number: 1, weight: '20', reps: '12' }])]),
			mkSession('2026-08-15', [bench([{ set_number: 1, weight: '60', reps: '12' }])])
		];
		expect(findLastExerciseSets(sessions, 'e1', 'Bench')).toEqual([
			{ set_number: 1, weight: '60', reps: '12' }
		]);
	});

	it('matches ad-hoc exercises by name when there is no id', () => {
		const sessions = [mkSession('2026-08-18', [adhoc([{ set_number: 1, weight: '20', reps: '12' }])])];
		const sets = findLastExerciseSets(sessions, null, 'Landmine Press');
		expect(sets).toEqual([{ set_number: 1, weight: '20', reps: '12' }]);
	});

	it('returns null when the exercise was never logged', () => {
		expect(findLastExerciseSets([], 'e1', 'Bench')).toBeNull();
		expect(findLastExerciseSets([mkSession('2026-08-18', [adhoc([])])], 'e1', 'Bench')).toBeNull();
	});

	it('skips sessions where the exercise had no logged sets (0 volume)', () => {
		const sessions = [
			mkSession('2026-08-18', [bench([])]),
			mkSession('2026-08-15', [bench([{ set_number: 1, weight: '60', reps: '12' }])])
		];
		expect(findLastExerciseSets(sessions, 'e1', 'Bench')).toEqual([
			{ set_number: 1, weight: '60', reps: '12' }
		]);
	});

	it('lastSetValues returns weight/reps for an existing set number', () => {
		const sets = [
			{ set_number: 1, weight: '60', reps: '12' },
			{ set_number: 2, weight: '60', reps: '10' }
		];
		expect(lastSetValues(sets, 2)).toEqual({ weight: '60', reps: '10' });
	});

	it('lastSetValues returns null for missing or empty sets', () => {
		const sets = [{ set_number: 1, weight: '60', reps: '12' }];
		expect(lastSetValues(sets, 3)).toBeNull();
		expect(lastSetValues(sets, 2)).toBeNull();
		expect(lastSetValues(null, 1)).toBeNull();
	});

	it('finds the last time each exercise was played, skipping workouts without it', () => {
		const sessions = [
			mkSession('2026-08-15', [squat([{ set_number: 1, weight: '100', reps: '5' }])]),
			mkSession('2026-08-16', [bench([{ set_number: 1, weight: '60', reps: '12' }])]),
			mkSession('2026-08-18', [squat([{ set_number: 1, weight: '105', reps: '5' }])])
		];
		const map = lastSetsByExercise(sessions, [
			{ id: 'a', exercise_id: 'e1', name: 'Bench' },
			{ id: 'b', exercise_id: 'e2', name: 'Squat' }
		]);
		expect(map.get('a')).toEqual([{ set_number: 1, weight: '60', reps: '12' }]);
		expect(map.get('b')).toEqual([{ set_number: 1, weight: '105', reps: '5' }]);
	});

	it('matches ad-hoc exercises by name and omits never-played ones', () => {
		const sessions = [mkSession('2026-08-18', [adhoc([{ set_number: 1, weight: '20', reps: '12' }])])];
		const map = lastSetsByExercise(sessions, [
			{ id: 'a', exercise_id: null, name: 'Landmine Press' },
			{ id: 'b', exercise_id: null, name: 'Nope' }
		]);
		expect(map.has('a')).toBe(true);
		expect(map.has('b')).toBe(false);
	});

	it('gives each exercise its own last-played history across different weeks', () => {
		const sessions = [
			mkSession('2026-08-10', [bench([{ set_number: 1, weight: '50', reps: '10' }])]),
			mkSession('2026-08-12', [bench([]), squat([{ set_number: 1, weight: '100', reps: '5' }])]),
			mkSession('2026-08-17', [squat([{ set_number: 1, weight: '110', reps: '5' }])])
		];
		const map = lastSetsByExercise(sessions, [
			{ id: 'a', exercise_id: 'e1', name: 'Bench' },
			{ id: 'b', exercise_id: 'e2', name: 'Squat' }
		]);
		expect(map.get('a')).toEqual([{ set_number: 1, weight: '50', reps: '10' }]);
		expect(map.get('b')).toEqual([{ set_number: 1, weight: '110', reps: '5' }]);
	});
});
