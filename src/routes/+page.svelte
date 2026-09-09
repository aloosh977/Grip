<script>
	import { Settings, Play, ChevronRight, ArrowUpRight } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { getSessions, getSettings } from '$lib/db.js';
	import { allStats } from '$lib/stats.js';
	import { active } from '$lib/sessionStore.svelte.js';
	import { formatNumber, formatDuration, formatDateLabel, todayKey, toDateKey, weekdayShortFromDate } from '$lib/utils.js';

	const CARD_DEFS = {
		totalWorkouts: { label: 'Total workouts', value: (s) => String(s.totalWorkouts), showUnit: false },
		bestWeek: { label: 'Best week', value: (s) => formatNumber(s.bestWeek), showUnit: true },
		bestDay: { label: 'Best day', value: (s) => formatNumber(s.bestDay), showUnit: true },
		volumeDay: { label: 'Total volume this day', value: (s) => formatNumber(s.volumeDay), showUnit: true }
	};

	let sessions = $state(getSessions());
	const settings = getSettings();
	const unit = settings.unit;
	const hasSession = $derived(active.value !== null);
	const stats = $derived(allStats(sessions, settings));

	const recent = $derived(
		[...sessions].sort((a, b) => new Date(b.started_at) - new Date(a.started_at)).slice(0, 3)
	);

	const optionalCards = $derived(
		settings.home_stats.map((key) => ({ key, ...CARD_DEFS[key] })).filter((c) => c && c.label)
	);
</script>

<div class="page">
	<div class="brand-row">
		<div class="brand">GR<b>IP</b></div>
		<div class="brand-tag">Get a grip</div>
		<div class="spacer"></div>
		<button class="gear" onclick={() => goto('/settings')} aria-label="Settings"><Settings size={22} /></button>
	</div>
	<div class="content">
		<div style="margin:6px 0 14px;">
			<div style="font-size:13px;color:var(--text-2);">Welcome back</div>
			<div style="font-family:var(--display);font-size:22px;text-transform:uppercase;margin-top:2px;">{formatDateLabel(todayKey())}</div>
		</div>

		{#if hasSession}
			<button class="btn primary btn-big" onclick={() => goto('/session')}>
				<Play size={20} /> Return to workout
			</button>
		{:else}
			<button class="btn primary btn-big" onclick={() => goto('/start')}>
				<Play size={20} /> Start workout
			</button>
		{/if}

		<div class="stat-grid">
			<div class="stat-card">
				<div class="label">Trained this week</div>
				<div class="value">{stats.trainedWeek} <small>/ {settings.weekly_goal}</small></div>
			</div>
			<div class="stat-card">
				<div class="label">Total volume this week</div>
				<div class="value">{formatNumber(stats.volumeWeek)} <small>{unit}</small></div>
			</div>
			{#each optionalCards as card (card.key)}
				<div class="stat-card">
					<div class="label">{card.label}</div>
					<div class="value">{card.value(stats)} {#if card.showUnit}<small>{unit}</small>{/if}</div>
				</div>
			{/each}
		</div>

		<div class="section-title">
			<h2>Recent workouts</h2>
			<button class="link-btn" onclick={() => goto('/calendar')}>
				<ArrowUpRight size={16} /> Calendar
			</button>
		</div>

		{#if recent.length === 0}
			<div class="empty">
				No workouts yet.
				<br />Hit <b style="color:var(--accent);">Start workout</b> to begin.
			</div>
		{:else}
			{#each recent as s (s.id)}
				<button class="row" onclick={() => goto(`/calendar/${toDateKey(new Date(s.started_at))}`)}>
					<div class="row-head">
						<div>
							<div class="row-name">{s.workout_name}</div>
							<div class="row-meta">{weekdayShortFromDate(new Date(s.started_at))} · {formatDuration(s.total_seconds)} · {formatNumber(s.total_volume)} {unit}</div>
						</div>
						<div class="chev"><ChevronRight size={18} /></div>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</div>
