// Storage layer — MVP uses localStorage behind this abstraction.
// Swap this file's backend for Supabase in Phase 2; nothing else changes.

const memory = new Map();

function backend() {
	if (typeof localStorage !== 'undefined') {
		return localStorage;
	}
	// in-memory fallback (tests, SSR)
	return {
		getItem: (k) => (memory.has(k) ? memory.get(k) : null),
		setItem: (k, v) => memory.set(k, String(v)),
		removeItem: (k) => memory.delete(k)
	};
}

const store = backend();

export function readJson(key, fallback) {
	try {
		const raw = store.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

export function writeJson(key, value) {
	store.setItem(key, JSON.stringify(value));
}

export function removeKey(key) {
	store.removeItem(key);
}

export function uid() {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
	return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

// ---- keys ----
export const KEYS = {
	exercises: 'gym.exercises',
	plans: 'gym.plans',
	sessions: 'gym.sessions',
	settings: 'gym.settings',
	activeSession: 'gym.active_session'
};

// ---- default settings ----
export const DEFAULT_SETTINGS = {
	unit: 'kg',
	weekly_goal: 3,
	week_start: 6, // getDay(): 0=Sun .. 6=Sat, default Saturday
	home_stats: [] // optional extras: totalWorkouts | bestWeek | bestDay | volumeDay
};

// ---- exercises ----
export function getExercises() {
	return readJson(KEYS.exercises, []);
}
export function saveExercises(list) {
	writeJson(KEYS.exercises, list);
}
export function getExercise(id) {
	return getExercises().find((e) => e.id === id) || null;
}

// ---- plans ----
export function getPlans() {
	return readJson(KEYS.plans, []);
}
export function savePlans(list) {
	writeJson(KEYS.plans, list);
}
export function getPlan(id) {
	return getPlans().find((p) => p.id === id) || null;
}

// ---- sessions ----
export function getSessions() {
	return readJson(KEYS.sessions, []);
}
export function saveSessions(list) {
	writeJson(KEYS.sessions, list);
}

// ---- settings ----
export function getSettings() {
	return { ...DEFAULT_SETTINGS, ...readJson(KEYS.settings, {}) };
}
export function saveSettings(s) {
	writeJson(KEYS.settings, s);
}

// ---- active (in-progress) session ----
export function loadActiveSession() {
	return readJson(KEYS.activeSession, null);
}
export function saveActiveSession(session) {
	if (session === null) removeKey(KEYS.activeSession);
	else writeJson(KEYS.activeSession, session);
}

// ---- export / import ----
export function exportAll() {
	return {
		version: 1,
		exported_at: new Date().toISOString(),
		data: {
			[KEYS.exercises]: getExercises(),
			[KEYS.plans]: getPlans(),
			[KEYS.sessions]: getSessions(),
			[KEYS.settings]: getSettings()
		}
	};
}

export function importAll(json) {
	if (!json || typeof json !== 'object' || !json.data) return false;
	const d = json.data;
	if (Array.isArray(d[KEYS.exercises])) writeJson(KEYS.exercises, d[KEYS.exercises]);
	if (Array.isArray(d[KEYS.plans])) writeJson(KEYS.plans, d[KEYS.plans]);
	if (Array.isArray(d[KEYS.sessions])) writeJson(KEYS.sessions, d[KEYS.sessions]);
	if (d[KEYS.settings] && typeof d[KEYS.settings] === 'object')
		writeJson(KEYS.settings, { ...DEFAULT_SETTINGS, ...d[KEYS.settings] });
	return true;
}

// ---- reset ----
// Wipes all data and resets settings to defaults.
export function resetAll() {
	for (const key of Object.values(KEYS)) {
		removeKey(key);
	}
}

// ---- seed ----
export function hasData() {
	return getExercises().length > 0 || getPlans().length > 0;
}
