<script>
	import { ChevronRight, Plus } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import Sheet from '$lib/components/Sheet.svelte';
	import { getPlans, savePlans, uid } from '$lib/db.js';
	import { showToast } from '$lib/toast.svelte.js';

	function totalExercises(workouts) {
		return workouts.reduce((a, w) => a + w.exercises.length, 0);
	}

	let plans = $state(getPlans());
	let newSheet = $state(false);
	let name = $state('');
	let description = $state('');

	function create() {
		if (!name.trim()) {
			showToast('Name required');
			return;
		}
		plans = [
			...plans,
			{
				id: uid(),
				name: name.trim(),
				description: description.trim(),
				workouts: [],
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			}
		];
		savePlans(plans);
		newSheet = false;
		name = '';
		description = '';
		showToast('Plan created');
	}
</script>

<div class="page">
	<div class="topbar">
		<h1>Plans</h1>
		<div class="spacer"></div>
		<button class="action" onclick={() => (newSheet = true)}>+ New</button>
	</div>
	<div class="content">
		{#if plans.length === 0}
			<div class="empty">
				Plans group your workouts.
				<br />Tap <b style="color:var(--accent);">+ New</b> to create one.
			</div>
		{:else}
			{#each plans as plan (plan.id)}
				<button class="row" onclick={() => goto(`/plans/${plan.id}`)}>
					<div class="row-head">
						<div>
							<div class="row-name">{plan.name}</div>
							<div class="row-meta">{plan.workouts.length} workouts · {totalExercises(plan.workouts)} exercises</div>
						</div>
						<div class="chev"><ChevronRight size={18} /></div>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</div>

<Sheet open={newSheet} title="New plan" onclose={() => (newSheet = false)}>
  <div class="field">
    <label for="plan-name">Name</label>
    <input id="plan-name" placeholder="e.g. Bro Split" bind:value={name} />
  </div>
  <div class="field">
    <label for="plan-desc">Description (optional)</label>
    <textarea id="plan-desc" placeholder="6-day hypertrophy split" bind:value={description}></textarea>
  </div>
	<button class="btn primary" onclick={create}>Create plan</button>
</Sheet>
