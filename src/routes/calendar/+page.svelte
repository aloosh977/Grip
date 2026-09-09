<script>
	import { ChevronLeft, ChevronRight, ChevronRight as RowChev } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { getSessions, getSettings } from '$lib/db.js';
	import { allStats, sessionsByDay } from '$lib/stats.js';
	import { weekdayShort, toDateKey, daysInMonth, monthLabel, formatCompact, formatDuration, formatNumber, todayKey, formatTimeOfDay } from '$lib/utils.js';

	const settings = getSettings();
	const unit = settings.unit;
	const weekStart = settings.week_start;

	let sessions = $state(getSessions());
	const today = todayKey();

	let viewYear = $state(new Date().getFullYear());
	let viewMonth = $state(new Date().getMonth());

	const stats = $derived(allStats(sessions, settings));
	const byDay = $derived(sessionsByDay(sessions));

	const cells = $derived.by(() => {
		const first = new Date(viewYear, viewMonth, 1);
		const leading = (first.getDay() - weekStart + 7) % 7;
		const total = daysInMonth(viewYear, viewMonth);
		const out = [];
		for (let i = 0; i < leading; i++) {
			const d = new Date(viewYear, viewMonth, 1 - leading + i);
			out.push({ key: toDateKey(d), day: d.getDate(), muted: true, isToday: false, volume: 0, count: 0 });
		}
		for (let day = 1; day <= total; day++) {
			const d = new Date(viewYear, viewMonth, day);
			const key = toDateKey(d);
			const daySessions = byDay.get(key) || [];
			const volume = daySessions.reduce((a, s) => a + (s.total_volume || 0), 0);
			out.push({ key, day, muted: false, isToday: key === today, volume, count: daySessions.length });
		}
		return out;
	});

	const selectedSessions = $derived(byDay.get(today) || []);

	function goMonth(delta) {
		let y = viewYear;
		let m = viewMonth + delta;
		if (m < 0) {
			m = 11;
			y -= 1;
		} else if (m > 11) {
			m = 0;
			y += 1;
		}
		viewYear = y;
		viewMonth = m;
	}
</script>

<div class="page">
	<div class="topbar"><h1>Calendar</h1></div>
	<div class="content">
		<div class="cal-strip">
			<div class="cal-badge">
				<div class="cb-label">Streak</div>
				<div class="cb-val">{stats.streak} <small class="goal">wks</small></div>
			</div>
			<div class="cal-badge">
				<div class="cb-label">This week</div>
				<div class="cb-val">{stats.trainedWeek} <small class="goal">/ {settings.weekly_goal}</small></div>
			</div>
		</div>

		<div class="cal-head">
			<button onclick={() => goMonth(-1)} aria-label="Previous month"><ChevronLeft size={22} /></button>
			<div class="month">{monthLabel(new Date(viewYear, viewMonth, 1))}</div>
			<button onclick={() => goMonth(1)} aria-label="Next month"><ChevronRight size={22} /></button>
		</div>

		<div class="cal-grid">
			{#each [0, 1, 2, 3, 4, 5, 6] as i (i)}
				<div class="cal-dow">{weekdayShort((weekStart + i) % 7)}</div>
			{/each}
			{#each cells as c (c.key)}
				<button
					class="cal-day"
					class:muted={c.muted}
					class:have={!c.muted && c.count > 0}
					class:selected={!c.muted && c.key === today}
					onclick={() => goto(`/calendar/${c.key}`)}
				>
					<span class="d">{c.day}</span>
					{#if c.count > 0}<span class="vol">{formatCompact(c.volume)}</span>{/if}
				</button>
			{/each}
		</div>

		{#if selectedSessions.length > 0}
			<div class="section-title" style="margin-top:var(--sp-6);"><h2>Today</h2></div>
			{#each selectedSessions as s (s.id)}
				<button class="row" onclick={() => goto(`/calendar/${today}`)}>
					<div class="row-head">
						<div>
							<div class="row-name">{s.workout_name}</div>
							<div class="row-meta">{formatTimeOfDay(new Date(s.started_at))} · {formatDuration(s.total_seconds)} · {formatNumber(s.total_volume)} {unit}</div>
						</div>
						<div class="chev"><RowChev size={18} /></div>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</div>
