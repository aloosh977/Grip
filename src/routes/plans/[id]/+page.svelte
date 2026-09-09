<script>
	import { ArrowLeft, ChevronRight, Plus, Trash2 } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Sheet from '$lib/components/Sheet.svelte';
	import { getPlans, savePlans, uid } from '$lib/db.js';
	import { showToast } from '$lib/toast.svelte.js';

	const id = $derived(page.params.id);
	let plans = $state(getPlans());
	const plan = $derived(plans.find((p) => p.id === id));

	let newSheet = $state(false);
	let deleteSheet = $state(false);
	let workoutName = $state('');

	function addWorkout() {
		if (!workoutName.trim()) {
			showToast('Name required');
			return;
		}
		plan.workouts.push({
			id: uid(),
			name: workoutName.trim(),
			sort_order: plan.workouts.length,
			exercises: []
		});
		savePlans(plans);
		newSheet = false;
		workoutName = '';
		showToast('Workout added');
	}

	function deletePlan() {
		plans = plans.filter((p) => p.id !== id);
		savePlans(plans);
		deleteSheet = false;
		showToast('Plan deleted');
		goto('/plans');
	}
</script>

<div class="page">
	<div class="topbar">
		<button class="back" onclick={() => goto('/plans')} aria-label="Back"><ArrowLeft size={22} /></button>
		<h1>{plan?.name ?? 'Plan'}</h1>
		<div class="spacer"></div>
		{#if plan}
			<button class="icon-btn danger" onclick={() => (deleteSheet = true)} aria-label="Delete plan"><Trash2 size={18} /></button>
		{/if}
	</div>
	<div class="content">
		{#if plan?.description}
			<div style="color:var(--text-2);font-size:13px;margin-bottom:var(--sp-4);">{plan.description}</div>
		{/if}
		<div class="section-title">
			<h2>Workouts</h2>
			<button class="link-btn" onclick={() => (newSheet = true)}>+ Workout</button>
		</div>
		{#if !plan}
			<div class="empty">Plan not found.</div>
		{:else if plan.workouts.length === 0}
			<div class="empty">
				No workouts in this plan yet.
				<br />Tap <b style="color:var(--accent);">+ Workout</b> to add one.
			</div>
		{:else}
			{#each plan.workouts as w (w.id)}
				<button class="row" onclick={() => goto(`/plans/${plan.id}/${w.id}`)}>
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

<Sheet open={newSheet} title="New workout" onclose={() => (newSheet = false)}>
  <div class="field">
    <label for="workout-name">Workout name</label>
    <input id="workout-name" placeholder="e.g. Push" bind:value={workoutName} />
  </div>
	<button class="btn primary" onclick={addWorkout}>Add workout</button>
</Sheet>

<Sheet open={deleteSheet} title="Delete plan" onclose={() => (deleteSheet = false)}>
	<div style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:var(--sp-4);">
		"<b style="color:var(--text);">{plan?.name}</b>" and all its workouts will be removed. Past sessions stay untouched.
	</div>
	<button class="btn danger-ghost" onclick={deletePlan}>Delete plan</button>
</Sheet>
