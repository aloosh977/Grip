<script>
	import { ChevronRight } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getPlans, getExercise } from '$lib/db.js';
	import { startSession } from '$lib/sessionStore.svelte.js';

	const planId = $derived(page.params.id);
	let plans = $state(getPlans());
	const plan = $derived(plans.find((p) => p.id === planId));

	function start(workout) {
		const exercises = workout.exercises
			.map((ref) => {
				const ex = getExercise(ref.exercise_id);
				return ex
					? {
							exercise_id: ex.id,
							name: ex.name,
							tool: ex.tool,
							muscle_primary: ex.muscle_primary,
							defaultSets: ref.sets ?? 3
						}
					: null;
			})
			.filter(Boolean);
		startSession(plan.name, workout.name, exercises);
		goto('/session');
	}
</script>

<div class="page">
	<div class="topbar">
		<button class="back" onclick={() => goto('/start')} aria-label="Back"><span style="font-size:24px;line-height:1;">‹</span></button>
		<h1>{plan?.name ?? 'Plan'}</h1>
	</div>
	<div class="content">
		<div class="section-title" style="margin-top:6px;"><h2>Choose workout</h2></div>
		{#if !plan}
			<div class="empty">Plan not found.</div>
		{:else if plan.workouts.length === 0}
			<div class="empty">This plan has no workouts yet.</div>
		{:else}
			{#each plan.workouts as w (w.id)}
				<button class="row" onclick={() => start(w)}>
					<div class="row-head">
						<div>
							<div class="row-name">{w.name}</div>
							<div class="row-meta">{w.exercises.length} exercises</div>
						</div>
						<div class="chev"><ChevronRight size={18} /></div>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</div>
