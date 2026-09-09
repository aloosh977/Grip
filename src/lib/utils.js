// Date + formatting helpers. All date keys are local YYYY-MM-DD.

const WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const WEEKDAYS_SHORT_SUN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const WEEKDAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function toDateKey(d) {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

export function todayKey() {
	return toDateKey(new Date());
}

export function parseDateKey(key) {
	const [y, m, d] = key.split('-').map(Number);
	return new Date(y, m - 1, d);
}

export function addDays(d, n) {
	const out = new Date(d);
	out.setDate(out.getDate() + n);
	return out;
}

export function startOfDay(d) {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// First day of the week for the given date, per weekStart (getDay(): 0=Sun..6=Sat).
export function weekStartDate(d, weekStart) {
	const day = startOfDay(d);
	const diff = (day.getDay() - weekStart + 7) % 7;
	return addDays(day, -diff);
}

export function weekKey(d, weekStart) {
	return toDateKey(weekStartDate(d, weekStart));
}

export function weekdayShortFromDate(d) {
	return WEEKDAYS_SHORT[(d.getDay() + 6) % 7];
}

export function weekdayShort(index) {
	// index 0=Sun..6=Sat (getDay convention)
	return WEEKDAYS_SHORT_SUN[index];
}

export function formatDateLabel(key) {
	const d = parseDateKey(key);
	return `${WEEKDAYS_FULL[(d.getDay() + 6) % 7]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function monthLabel(d) {
	return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function daysInMonth(year, month) {
	return new Date(year, month + 1, 0).getDate();
}

export function formatNumber(n) {
	return Math.round(n).toLocaleString('en-US');
}

export function formatCompact(n) {
	if (n >= 1000000) return (n / 1000000).toFixed(1) + 'm';
	if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
	return String(Math.round(n));
}

export function formatDuration(totalSeconds) {
	const s = Math.max(0, Math.floor(totalSeconds));
	const hh = String(Math.floor(s / 3600)).padStart(2, '0');
	const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
	const ss = String(s % 60).padStart(2, '0');
	return `${hh}:${mm}:${ss}`;
}

export function formatClockMinSec(seconds) {
	const s = Math.max(0, Math.floor(seconds));
	const mm = String(Math.floor(s / 60)).padStart(2, '0');
	const ss = String(s % 60).padStart(2, '0');
	return `${mm}:${ss}`;
}

export function formatTimeOfDay(d) {
	let h = d.getHours();
	const m = String(d.getMinutes()).padStart(2, '0');
	const ampm = h >= 12 ? 'PM' : 'AM';
	h = h % 12 || 12;
	return `${h}:${m} ${ampm}`;
}
