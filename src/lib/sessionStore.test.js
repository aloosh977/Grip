import { describe, it, expect, beforeEach } from 'vitest';
import {
	startSession,
	finishSession,
	updateSet,
	addSet,
	removeSet,
	addLibraryExercise,
	totalVolume,
	totalLoggedSets
} from './sessionStore.svelte.js';
import { getSessions, saveSessions, loadActiveSession } from './db.js';

beforeEach(() => {
	saveSessions([]);
});

describe('finishSession', () => {
	it('saves a session with snapshots, volume, and set counts', () => {
		startSession('Bro Split', 'Push', [
			{ exercise_id: 'e1', name: 'Bench', tool: 'Barbell', muscle_primary: 'Chest', defaultSets: 2 },
			{ exercise_id: null, name: 'Ad Hoc', tool: 'Dumbbell', muscle_primary: '', defaultSets: 1 }
		]);

		const bench = loadActiveSession().exercises.find((e) => e.exercise_id === 'e1');
		const adhoc = loadActiveSession().exercises.find((e) => e.exercise_id === null);
		updateSet(bench.id, 0, '60', '10');
		updateSet(bench.id, 1, '60', '10');
		updateSet(adhoc.id, 0, '20', '12');

		expect(totalVolume()).toBe(1440);
		expect(totalLoggedSets()).toBe(3);

		const rec = finishSession();
		expect(rec).not.toBeNull();
		expect(rec.total_volume).toBe(1440);
		expect(rec.total_sets).toBe(3);
		expect(rec.plan_name).toBe('Bro Split');
		expect(rec.workout_name).toBe('Push');
		expect(rec.exercises[0].exercise_name).toBe('Bench');
		expect(rec.exercises[1].exercise_id).toBe(null);
		expect(rec.exercises[1].exercise_name).toBe('Ad Hoc');

		const saved = getSessions();
		expect(saved).toHaveLength(1);
		expect(saved[0].total_volume).toBe(1440);
		expect(saved[0].exercises[0].exercise_name).toBe('Bench');
		expect(loadActiveSession()).toBeNull();
	});

	it('ignores unlogged sets and does not create empty sessions', () => {
		startSession('Plan', 'Workout', [{ exercise_id: 'e1', name: 'X', tool: '', muscle_primary: '', defaultSets: 2 }]);
		updateSet(loadActiveSession().exercises[0].id, 0, '', '');
		const rec = finishSession();
		expect(rec.total_volume).toBe(0);
		expect(rec.total_sets).toBe(0);
		expect(rec.exercises[0].sets).toEqual([]);
	});

	it('addSet and removeSet keep set numbering sequential', () => {
		startSession('Plan', 'Workout', [{ exercise_id: 'e1', name: 'X', tool: '', muscle_primary: '', defaultSets: 1 }]);
		const ex = loadActiveSession().exercises[0];
		addSet(ex.id);
		addSet(ex.id);
		const updated = loadActiveSession().exercises[0];
		expect(updated.sets.map((s) => s.set_number)).toEqual([1, 2, 3]);
		removeSet(ex.id, 1);
		const after = loadActiveSession().exercises[0];
		expect(after.sets.map((s) => s.set_number)).toEqual([1, 2]);
	});

	it('addLibraryExercise adds from the library with default sets', () => {
		startSession('Plan', 'Workout', [{ exercise_id: 'e1', name: 'X', tool: '', muscle_primary: '', defaultSets: 1 }]);
		addLibraryExercise({ id: 'e9', name: 'Squat', tool: 'Barbell', muscle_primary: 'Legs' });
		const exs = loadActiveSession().exercises;
		expect(exs).toHaveLength(2);
		const added = exs.find((e) => e.exercise_id === 'e9');
		expect(added).toBeTruthy();
		expect(added.name).toBe('Squat');
		expect(added.muscle_primary).toBe('Legs');
		expect(added.sets).toHaveLength(3);
		expect(added.sets.map((s) => s.set_number)).toEqual([1, 2, 3]);
	});
});
