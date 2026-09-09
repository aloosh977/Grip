import { describe, it, expect, beforeEach } from 'vitest';
import { ensureDefaultExercises, ensureSeed } from './seed.js';
import { getExercises, getSessions, getPlans, saveExercises, resetAll, KEYS, removeKey, uid } from './db.js';

beforeEach(() => {
	for (const k of Object.values(KEYS)) removeKey(k);
});

describe('default exercises', () => {
	it('seeds the full default catalog with stable ids and markers', () => {
		const list = ensureDefaultExercises();
		expect(list.length).toBeGreaterThan(0);
		expect(list.every((e) => e.is_default === true)).toBe(true);
		expect(list.every((e) => e.image_url === '')).toBe(true);
		expect(list.every((e) => e.id.startsWith('def-'))).toBe(true);
		expect(new Set(list.map((e) => e.id)).size).toBe(list.length);
		// tool labels are capitalized to match the app's filter/form options
		expect(list.every((e) => /^[A-Z]/.test(e.tool))).toBe(true);
		// stable id: same exercise maps to the same id every time
		const again = ensureDefaultExercises();
		expect(again.map((e) => e.id)).toEqual(list.map((e) => e.id));
	});

	it('is idempotent — running twice does not duplicate', () => {
		ensureDefaultExercises();
		const second = ensureDefaultExercises();
		const byId = new Map(second.map((e) => [e.id, e]));
		expect(second.length).toBe(byId.size);
	});

	it('keeps custom exercises untouched', () => {
		const custom = {
			id: uid(),
			name: 'My Custom Lift',
			description: '',
			image_url: '',
			tool: 'Dumbbell',
			muscle_primary: 'Chest',
			muscles_secondary: [],
			is_default: false,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};
		saveExercises([custom]);
		const list = ensureDefaultExercises();
		const stillThere = list.find((e) => e.id === custom.id);
		expect(stillThere).toBeTruthy();
		expect(stillThere.name).toBe('My Custom Lift');
		expect(stillThere.is_default).toBe(false);
	});
});

describe('ensureSeed', () => {
	it('first launch merges defaults but seeds no plans and no history', () => {
		const list = ensureSeed();
		expect(list.some((e) => e.is_default)).toBe(true);
		expect(getPlans().length).toBe(0);
		expect(getSessions().length).toBe(0);

		// idempotent — re-running does not add plans, sessions, or duplicates
		ensureSeed();
		expect(getPlans().length).toBe(0);
		expect(getSessions().length).toBe(0);
		expect(getExercises().length).toBe(list.length);
	});

	it('reset wipes user data but keeps built-in defaults', () => {
		ensureSeed();
		saveExercises([
			{
				id: uid(),
				name: 'Custom',
				description: '',
				image_url: '',
				tool: 'Barbell',
				muscle_primary: 'Chest',
				muscles_secondary: [],
				is_default: false,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			}
		]);
		resetAll();
		// defaults return, demo does not, no customs remain
		const list = ensureSeed();
		expect(list.every((e) => e.is_default === true)).toBe(true);
		expect(list.some((e) => e.name === 'Custom')).toBe(false);
		expect(getPlans().length).toBe(0);
		expect(getSessions().length).toBe(0);
	});
});
