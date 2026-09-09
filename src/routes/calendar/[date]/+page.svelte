<script>
	import { ArrowLeft } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getSessions, getSettings } from '$lib/db.js';
	import { formatDateLabel, formatNumber, formatDuration, formatTimeOfDay, toDateKey } from '$lib/utils.js';

	const dateKey = $derived(page.params.date);
	const settings = getSettings();
	const unit = settings.unit;

	let sessions = $state(getSessions());
	const daySessions = $derived(
		sessions
			.filter((s) => toDateKey(new Date(s.started_at)) === dateKey)
			.sort((a, b) => new Date(b.started_at) - new Date(a.started_at))
	);

	const totals = $derived.by(() => {
		let volume = 0;
		let seconds = 0;
		let sets = 0;
		for (const s of daySessions) {
			volume += s.total_volume || 0;
			seconds += s.total_seconds || 0;
			sets += s.total_sets || 0;
		}
		return { volume, seconds, sets };
	});
</script>

<div class="page">
	<div class="topbar">
		<button class="back" onclick={() => goto('/calendar')} aria-label="Back"><ArrowLeft size={22} /></button>
		<h1>{dateKey ? formatDateLabel(dateKey) : ''}</h1>
	</div>
	<div class="content">
		{#if daySessions.length === 0}
			<div class="empty">No workouts on this day.</div>
		{:else}
			<div class="stat-grid">
				<div class="stat-card"><div class="label">Workouts</div><div class="value">{daySessions.length}</div></div>
				<div class="stat-card"><div class="label">Volume</div><div class="value">{formatNumber(totals.volume)} <small>{unit}</small></div></div>
				<div class="stat-card"><div class="label">Time</div><div class="value">{formatDuration(totals.seconds)}</div></div>
				<div class="stat-card"><div class="label">Sets</div><div class="value">{totals.sets}</div></div>
			</div>

			{#each daySessions as s (s.id)}
				<div class="ex-row" style="margin-top:var(--sp-4);">
					<div class="ex-head">
						<div>
							<div class="ex-name">{s.workout_name}</div>
							<div class="ex-meta">{s.plan_name} · {formatTimeOfDay(new Date(s.started_at))} · {formatDuration(s.total_seconds)} · {formatNumber(s.total_volume)} {unit}</div>
						</div>
					</div>
					{#each s.exercises as e (e.id)}
						<div style="margin-top:14px;">
							<div class="ex-name" style="font-size:13px;">{e.exercise_name}</div>
							<div class="sets" style="margin-top:6px;">
								{#each e.sets as set (set.set_number)}
									<div class="set-chip"><span class="label">Set {set.set_number}</span><span class="value">{set.weight}×{set.reps}</span></div>
								{/each}
							</div>
							<div class="ex-meta" style="margin-top:6px;color:var(--accent);font-family:var(--display);font-variant-numeric:tabular-nums;">vol {formatNumber(e.volume)}</div>
						</div>
					{/each}
				</div>
			{/each}
		{/if}
	</div>
</div>
