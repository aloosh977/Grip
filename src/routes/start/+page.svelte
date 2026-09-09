<script>
	import { ChevronRight } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { getPlans } from '$lib/db.js';

	let plans = $state(getPlans());
</script>

<div class="page">
	<div class="topbar">
		<button class="back" onclick={() => goto('/')} aria-label="Back"><span style="font-size:24px;line-height:1;">‹</span></button>
		<h1>Start</h1>
	</div>
	<div class="content">
		<div class="section-title" style="margin-top:6px;"><h2>Choose a plan</h2></div>
		{#if plans.length === 0}
			<div class="empty">Create a plan first in the Plans tab.</div>
		{:else}
			{#each plans as plan (plan.id)}
				<button class="row" onclick={() => goto(`/start/${plan.id}`)}>
					<div class="row-head">
						<div>
							<div class="row-name">{plan.name}</div>
							<div class="row-meta">{plan.workouts.length} workouts</div>
						</div>
						<div class="chev"><ChevronRight size={18} /></div>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</div>
