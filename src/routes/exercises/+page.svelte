<script>
	import { Plus, Search, ChevronRight } from '@lucide/svelte';
	import Sheet from '$lib/components/Sheet.svelte';
	import { getExercises, saveExercises, getPlans, savePlans, uid } from '$lib/db.js';
	import { showToast } from '$lib/toast.svelte.js';

	const TOOLS = ['All', 'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Bands', 'Other'];
	const PRIMARY = ['Chest', 'Back', 'Lats', 'Upper Back', 'Lower Back', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Front Delts', 'Side Delts', 'Rear Delts', 'Traps', 'Biceps', 'Triceps', 'Forearms', 'Abs', 'Obliques', 'Legs', 'Shoulders', 'Arms', 'Core'];
	const SECONDARY = ['Triceps', 'Biceps', 'Forearms', 'Front Delts', 'Side Delts', 'Rear Delts', 'Lats', 'Upper Back', 'Lower Back', 'Traps', 'Glutes', 'Hamstrings', 'Quads', 'Calves', 'Chest', 'Core', 'Abs', 'Obliques', 'Hip Flexors', 'Thighs', 'Shoulders', 'Legs', 'Adductors', 'Brachialis'];
	const MUSCLE_ORDER = [
		'Chest', 'Back', 'Lats', 'Upper Back', 'Lower Back', 'Quads', 'Hamstrings', 'Glutes', 'Calves',
		'Front Delts', 'Side Delts', 'Rear Delts', 'Traps', 'Biceps', 'Triceps', 'Forearms', 'Abs',
		'Core', 'Obliques', 'Hip Flexors', 'Thighs', 'Adductors', 'Brachialis', 'Shoulders', 'Arms', 'Legs'
	];

	let exercises = $state(getExercises());
	let plans = $state(getPlans());

	let search = $state('');
	let toolFilter = $state('All');
	let muscleFilter = $state('All');

	const MUSCLES = $derived([
		'All',
		...[
			...new Set(
				exercises.flatMap((e) => [e.muscle_primary, ...(e.muscles_secondary || [])])
			)
		].sort((a, b) => {
			const ia = MUSCLE_ORDER.indexOf(a);
			const ib = MUSCLE_ORDER.indexOf(b);
			return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
		})
	]);

	const filtered = $derived(
		exercises.filter((e) => {
			const matchesSearch = e.name.toLowerCase().includes(search.trim().toLowerCase());
			const matchesTool = toolFilter === 'All' || e.tool === toolFilter;
			const muscles = [e.muscle_primary, ...(e.muscles_secondary || [])];
			const matchesMuscle = muscleFilter === 'All' || muscles.includes(muscleFilter);
			return matchesSearch && matchesTool && matchesMuscle;
		})
	);

	let sheetOpen = $state(false);
	let editingId = $state(null);
	let confirmDelete = $state(false);
	const isEditingDefault = $derived(
		editingId ? exercises.find((e) => e.id === editingId)?.is_default === true : false
	);
	let formName = $state('');
	let formDesc = $state('');
	let formImage = $state('');
	let formTool = $state('Barbell');
	let formPrimary = $state('Chest');
	let formSecondary = $state([]);

	function openNew() {
		editingId = null;
		confirmDelete = false;
		formName = '';
		formDesc = '';
		formImage = '';
		formTool = 'Barbell';
		formPrimary = 'Chest';
		formSecondary = [];
		sheetOpen = true;
	}

	function openEdit(ex) {
		editingId = ex.id;
		confirmDelete = false;
		formName = ex.name;
		formDesc = ex.description || '';
		formImage = ex.image_url || '';
		formTool = ex.tool;
		formPrimary = ex.muscle_primary;
		formSecondary = [...(ex.muscles_secondary || [])];
		sheetOpen = true;
	}

	function toggleSecondary(muscle) {
		formSecondary = formSecondary.includes(muscle)
			? formSecondary.filter((m) => m !== muscle)
			: [...formSecondary, muscle];
	}

	function save() {
		if (!formName.trim()) {
			showToast('Name required');
			return;
		}
		if (editingId) {
			const ex = exercises.find((e) => e.id === editingId);
			if (ex) {
				Object.assign(ex, {
					name: formName.trim(),
					description: formDesc.trim(),
					image_url: formImage.trim(),
					tool: formTool,
					muscle_primary: formPrimary,
					muscles_secondary: formSecondary,
					updated_at: new Date().toISOString()
				});
			}
		} else {
			exercises = [
				...exercises,
				{
					id: uid(),
					name: formName.trim(),
					description: formDesc.trim(),
					image_url: formImage.trim(),
					tool: formTool,
					muscle_primary: formPrimary,
					muscles_secondary: formSecondary,
					is_default: false,
					emoji: '🏋',
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				}
			];
		}
		saveExercises(exercises);
		sheetOpen = false;
		showToast(editingId ? 'Saved' : 'Exercise added to library');
	}

	function deleteExercise() {
		const id = editingId;
		// remove from plan templates (past sessions keep snapshots)
		plans = plans.map((p) => ({
			...p,
			workouts: p.workouts.map((w) => ({
				...w,
				exercises: w.exercises.filter((r) => r.exercise_id !== id)
			}))
		}));
		exercises = exercises.filter((e) => e.id !== id);
		saveExercises(exercises);
		savePlans(plans);
		sheetOpen = false;
		showToast('Deleted from library');
	}
</script>

<div class="page">
	<div class="topbar">
		<h1>Exercises</h1>
		<div class="spacer"></div>
		<button class="action" onclick={openNew}>+ New</button>
	</div>
	<div class="content">
		<div class="search">
			<span class="ic"><Search size={18} /></span>
			<input placeholder="Search exercises..." bind:value={search} />
		</div>
		<div class="filter-row">
			{#each MUSCLES as m (m)}
				<button class="chip" class:active={muscleFilter === m} onclick={() => (muscleFilter = m)}>{m}</button>
			{/each}
		</div>
		<div class="filter-row">
			{#each TOOLS as t (t)}
				<button class="chip" class:active={toolFilter === t} onclick={() => (toolFilter = t)}>{t}</button>
			{/each}
		</div>

		{#if filtered.length === 0}
			<div class="empty">
				No exercises found.
				<br />Tap <b style="color:var(--accent);">+ New</b> to add one.
			</div>
		{:else}
			{#each filtered as ex (ex.id)}
				<button class="list-row" onclick={() => openEdit(ex)}>
					<div class="thumb">{#if ex.image_url}<img src={ex.image_url} alt="" />{:else}<span class="ic">{ex.emoji || '🏋'}</span>{/if}</div>
					<div class="info">
						<div class="t">{ex.name}</div>
						<div class="m">{ex.muscle_primary} • {ex.tool}</div>
					</div>
					<div class="chev"><ChevronRight size={18} /></div>
				</button>
			{/each}
		{/if}
	</div>
</div>

<Sheet open={sheetOpen} title={editingId ? 'Edit exercise' : 'New exercise'} onclose={() => (sheetOpen = false)}>
	{#if isEditingDefault}
		<div class="tag-default" style="align-self:flex-start;margin-bottom:var(--sp-4);">Default</div>
	{/if}
  <div class="field"><label for="ex-name">Name</label><input id="ex-name" placeholder="e.g. Squat" bind:value={formName} /></div>
  <div class="field"><label for="ex-desc">Short description</label><textarea id="ex-desc" placeholder="Knees track over toes, chest up" bind:value={formDesc}></textarea></div>
  <div class="field"><label for="ex-image">Image URL</label><input id="ex-image" placeholder="https://..." bind:value={formImage} /></div>
  <div class="field">
    <label for="ex-tool">Tool</label>
    <select id="ex-tool" bind:value={formTool}>
      {#each TOOLS.filter((t) => t !== 'All') as t (t)}<option>{t}</option>{/each}
    </select>
  </div>
  <div class="field">
    <div class="field-label">Primary muscle</div>
    <div class="chips">
      {#each PRIMARY as m (m)}
        <button class="chip" class:active={formPrimary === m} onclick={() => (formPrimary = m)}>{m}</button>
      {/each}
    </div>
  </div>
  <div class="field">
    <div class="field-label">Secondary muscles (optional)</div>
    <div class="chips">
      {#each SECONDARY as m (m)}
        <button class="chip" class:active={formSecondary.includes(m)} onclick={() => toggleSecondary(m)}>{m}</button>
      {/each}
    </div>
  </div>
	<button class="btn primary" onclick={save}>{editingId ? 'Save changes' : 'Save exercise'}</button>
	{#if editingId && !isEditingDefault}
		<div style="height:8px"></div>
		<button
			class="btn danger-ghost"
			onclick={() => (confirmDelete ? deleteExercise() : (confirmDelete = true))}
		>
			{confirmDelete ? 'Tap again to confirm delete' : 'Delete exercise'}
		</button>
	{:else if isEditingDefault}
		<div style="height:8px"></div>
		<div style="font-size:11px;color:var(--text-3);line-height:1.5;text-align:center;">
			Default exercise — built into the app, can't be deleted.
		</div>
	{/if}
</Sheet>
