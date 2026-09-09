<script>
	import { ArrowLeft, ChevronRight, Trash2, Play, Plus, X, ArrowUp, ArrowDown, Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Sheet from '$lib/components/Sheet.svelte';
	import { getPlans, savePlans, getExercises, getExercise, uid } from '$lib/db.js';
	import { startSession } from '$lib/sessionStore.svelte.js';
	import { showToast } from '$lib/toast.svelte.js';

	const planId = $derived(page.params.id);
	const workoutId = $derived(page.params.workoutId);
	let plans = $state(getPlans());
	let library = $state(getExercises());

	const plan = $derived(plans.find((p) => p.id === planId));
	const workout = $derived(plan?.workouts.find((w) => w.id === workoutId) ?? null);

	const resolved = $derived(
		(workout?.exercises ?? [])
			.map((ref) => {
				const ex = getExercise(ref.exercise_id);
				return ex
					? { ref, ex, name: ex.name, tool: ex.tool, muscle: ex.muscle_primary }
					: null;
			})
			.filter(Boolean)
	);

	let addSheet = $state(false);
	let deleteSheet = $state(false);
	let search = $state('');
	const libraryFiltered = $derived(
		library.filter((e) => e.name.toLowerCase().includes(search.trim().toLowerCase()))
	);
	const inWorkout = $derived(new Set((workout?.exercises ?? []).map((r) => r.exercise_id)));

	function start() {
		const exercises = resolved.map((r) => ({
			exercise_id: r.ex.exercise_id ?? r.ref.exercise_id,
			name: r.ex.name,
			tool: r.ex.tool,
			muscle_primary: r.ex.muscle_primary,
			defaultSets: r.ref.sets ?? 3
		}));
		startSession(plan.name, workout.name, exercises);
		goto('/session');
	}

	function addExercise(ex) {
		if (inWorkout.has(ex.id)) return;
		workout.exercises.push({ exercise_id: ex.id, sort_order: workout.exercises.length, sets: 3 });
		savePlans(plans);
		showToast(`${ex.name} added`);
	}

	function removeExercise(index) {
		workout.exercises.splice(index, 1);
		savePlans(plans);
	}

	function moveExercise(index, dir) {
		const target = index + dir;
		if (target < 0 || target >= workout.exercises.length) return;
		const list = workout.exercises;
		[list[index], list[target]] = [list[target], list[index]];
		savePlans(plans);
	}

	function changeSets(index, delta) {
		const ref = workout.exercises[index];
		if (!ref) return;
		ref.sets = Math.max(1, Math.min(20, (ref.sets ?? 3) + delta));
		savePlans(plans);
	}

	function deleteWorkout() {
		plan.workouts = plan.workouts.filter((w) => w.id !== workoutId);
		savePlans(plans);
		deleteSheet = false;
		showToast('Workout deleted');
		goto(`/plans/${planId}`);
	}
</script>

<div class="page">
	<div class="topbar">
		<button class="back" onclick={() => goto(`/plans/${planId}`)} aria-label="Back"><ArrowLeft size={22} /></button>
		<h1>{workout?.name ?? 'Workout'}</h1>
		<div class="spacer"></div>
		{#if workout}
			<button class="icon-btn danger" onclick={() => (deleteSheet = true)} aria-label="Delete workout"><Trash2 size={18} /></button>
		{/if}
	</div>
	<div class="content">
		{#if !plan || !workout}
			<div class="empty">Workout not found.</div>
		{:else}
			<button class="btn primary" style="margin:4px 0 16px;" onclick={start}><Play size={18} /> Start this workout</button>
			<div class="section-title"><h2>Exercises</h2><button class="link-btn" onclick={() => (addSheet = true)}>+ Add</button></div>

			{#if resolved.length === 0}
				<div class="empty">
					No exercises yet.
					<br />Tap <b style="color:var(--accent);">+ Add</b> to add from your library.
				</div>
			{:else}
				{#each resolved as r, i (r.ref.exercise_id)}
					<div class="ex-row">
						<div class="ex-head">
							<div class="ex-info">
								<div class="ex-name">{r.name}</div>
								<div class="ex-meta">{r.muscle} · {r.tool}</div>
								<div class="sets-stepper">
									<span class="ss-label">Sets</span>
									<div class="ss-control">
										<button onclick={() => changeSets(i, -1)} aria-label="Decrease sets">−</button>
										<span class="ss-val">{r.ref.sets ?? 3}</span>
										<button onclick={() => changeSets(i, 1)} aria-label="Increase sets">＋</button>
									</div>
								</div>
							</div>
							<div class="stack-actions">
								<button class="icon-btn" class:disabled={i === 0} onclick={() => moveExercise(i, -1)} aria-label="Move up"><ArrowUp size={15} /></button>
								<button class="icon-btn" class:disabled={i === resolved.length - 1} onclick={() => moveExercise(i, 1)} aria-label="Move down"><ArrowDown size={15} /></button>
								<button class="icon-btn danger" onclick={() => removeExercise(i)} aria-label="Remove"><X size={15} /></button>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		{/if}
	</div>
</div>

<Sheet open={addSheet} title="Add exercise" onclose={() => (addSheet = false)}>
	<div class="search"><span class="ic"><Search size={18} /></span><input placeholder="Search library..." bind:value={search} /></div>
	{#if libraryFiltered.length === 0}
		<div class="empty" style="padding:30px 10px;">No exercises found. Add one in Exercises first.</div>
	{:else}
		{#each libraryFiltered as ex (ex.id)}
			<button class="list-row" onclick={() => addExercise(ex)}>
				<div class="thumb">{#if ex.image_url}<img src={ex.image_url} alt="" />{:else}<span class="ic">{ex.emoji || '🏋'}</span>{/if}</div>
				<div class="info">
					<div class="t">{ex.name}</div>
					<div class="m">{ex.tool} · {ex.muscle_primary}</div>
				</div>
				{#if inWorkout.has(ex.id)}
					<div class="dim" style="font-size:12px;">Added</div>
				{:else}
					<span class="icon-btn" style="pointer-events:none;" aria-hidden="true"><Plus size={18} /></span>
				{/if}
			</button>
		{/each}
	{/if}
</Sheet>

<Sheet open={deleteSheet} title="Delete workout" onclose={() => (deleteSheet = false)}>
	<div style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:var(--sp-4);">
		"<b style="color:var(--text);">{workout?.name}</b>" will be removed from the plan. Past sessions stay untouched.
	</div>
	<button class="btn danger-ghost" onclick={deleteWorkout}>Delete workout</button>
</Sheet>
