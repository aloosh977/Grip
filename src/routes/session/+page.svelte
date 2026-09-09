<script>
	import { ArrowLeft, Plus, X, Play, Check, Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import Sheet from '$lib/components/Sheet.svelte';
	import { getSettings, getExercises, getSessions } from '$lib/db.js';
	import { isSetLogged, lastSetsByExercise, lastSetValues } from '$lib/stats.js';
	import {
		active,
		addSet,
		updateSet,
		removeSet,
		addAdHoc,
		addLibraryExercise,
		removeExercise,
		firstUnloggedSet,
		exerciseVolume,
		totalVolume,
		totalLoggedSets,
		finishSession,
		discardSession
	} from '$lib/sessionStore.svelte.js';
	import { showToast } from '$lib/toast.svelte.js';
	import { formatDuration, formatTimeOfDay, formatClockMinSec, formatNumber, todayKey } from '$lib/utils.js';

	const unit = getSettings().unit;

	let mode = $state('focus');
	let setSheet = $state(null); // { exId, index, fromFocus }
	let addView = $state(null); // null | 'library' | 'adhoc'
	let endSheet = $state(false);
	let restOpen = $state(false);
	let restElapsed = $state(0);

	let lib = $state([]);
	let sessionSearch = $state('');
	const libFiltered = $derived(
		lib.filter((e) => e.name.toLowerCase().includes(sessionSearch.trim().toLowerCase()))
	);
	const inSession = $derived(
		new Set((active.value?.exercises ?? []).map((e) => e.exercise_id).filter(Boolean))
	);

	// Past completed sessions — read once; they don't change while a session runs.
	const sessions = getSessions();
	const historySetsByEx = $derived(lastSetsByExercise(sessions, active.value?.exercises ?? []));

	function openAddSheet() {
		addView = 'library';
		sessionSearch = '';
		lib = getExercises();
	}

	function addFromLibrary(ex) {
		if (inSession.has(ex.id)) return;
		addLibraryExercise(ex);
		showToast(`${ex.name} added`);
	}

	let reps = $state('');
	let weight = $state('');

	let elapsedSec = $state(0);
	$effect(() => {
		if (!active.value) return;
		const update = () => {
			elapsedSec = Math.max(0, Math.round((Date.now() - new Date(active.value.started_at).getTime()) / 1000));
		};
		update();
		const id = setInterval(update, 1000);
		return () => clearInterval(id);
	});

	$effect(() => {
		if (!restOpen) return;
		restElapsed = 0;
		const id = setInterval(() => restElapsed++, 1000);
		return () => clearInterval(id);
	});

	const currentEx = $derived.by(() => {
		if (!active.value) return null;
		return (
			active.value.exercises.find((e) => e.sets.some((s) => !isSetLogged(s))) ??
			active.value.exercises[0] ??
			null
		);
	});
	const focusSet = $derived(currentEx ? firstUnloggedSet(currentEx) : null);
	const focusLast = $derived(
		currentEx && focusSet
			? lastSetValues(historySetsByEx.get(currentEx.id), focusSet.set.set_number)
			: null
	);
	const setSheetHistory = $derived(
		setSheet
			? lastSetValues(
					historySetsByEx.get(setSheet.exId),
					active.value?.exercises.find((e) => e.id === setSheet.exId)?.sets?.[setSheet.index]?.set_number
				)
			: null
	);

	function openSetSheet(exId, index, fromFocus) {
		setSheet = { exId, index, fromFocus };
		const ex = active.value.exercises.find((e) => e.id === exId);
		const set = ex?.sets[index];
		reps = set?.reps || '';
		weight = set?.weight || '';
	}

	function saveSet() {
		if (!setSheet) return;
		const r = parseFloat(reps);
		const w = parseFloat(weight);
		if (!Number.isFinite(r) || !Number.isFinite(w) || r <= 0 || w <= 0) {
			showToast('Enter reps and weight');
			return;
		}
		updateSet(setSheet.exId, setSheet.index, weight, reps);
		const fromFocus = setSheet.fromFocus;
		setSheet = null;
		if (fromFocus) restOpen = true;
	}

	function removeCurrentSet() {
		if (!currentEx || !focusSet) return;
		removeSet(currentEx.id, focusSet.index);
	}

	function addAdHocExercise() {
		if (!adhocName.trim()) {
			showToast('Name required');
			return;
		}
		addAdHoc(adhocName.trim(), adhocTool);
		addView = null;
		adhocName = '';
		adhocTool = 'Dumbbell';
		showToast('Added to this session only');
	}

	let adhocName = $state('');
	let adhocTool = $state('Dumbbell');

	function saveWorkout() {
		const rec = finishSession();
		if (!rec) return;
		endSheet = false;
		showToast('Workout saved to calendar');
		goto(`/calendar/${todayKey()}`);
	}

	function discard() {
		discardSession();
		endSheet = false;
		showToast('Workout discarded');
		goto('/');
	}
</script>

{#if !active.value}
	<div class="page">
		<div class="empty">
			No workout in progress.
			<br />
			<button class="btn primary" style="margin-top:var(--sp-5);" onclick={() => goto('/start')}><Play size={18} /> Start workout</button>
		</div>
	</div>
{:else}
	<div class="page">
		<div class="session-top">
			<div class="session-plan">{active.value.plan_name}</div>
			<div class="session-workout">{active.value.workout_name}</div>
		</div>
		<div class="timer-wrap">
			<div class="timer">{formatDuration(elapsedSec)}</div>
			<div class="timer-sub">total time</div>
		</div>

		<div class="segment" style="margin:4px 20px 12px;">
			<button class="seg" class:active={mode === 'list'} onclick={() => (mode = 'list')}>List</button>
			<button class="seg" class:active={mode === 'focus'} onclick={() => (mode = 'focus')}>Focus</button>
		</div>

		<div class="mode-session" class:hidden={mode !== 'list'}>
			<div class="content">
				{#each active.value.exercises as ex (ex.id)}
					<div class="ex-row">
						<div class="ex-head">
							<div>
								<div class="ex-name">{ex.name}</div>
								<div class="ex-meta">{ex.muscle_primary || ex.tool || 'Session only'}{ex.exercise_id === null ? ' · session only' : ''}</div>
							</div>
							<button class="icon-btn danger" onclick={() => removeExercise(ex.id)} aria-label="Skip exercise"><X size={16} /></button>
						</div>
						<div class="sets">
							{#each ex.sets as set, i (i)}
								{@const hist = isSetLogged(set) ? null : lastSetValues(historySetsByEx.get(ex.id), set.set_number)}
								<button class="set-chip" class:done={isSetLogged(set)} class:unlogged={!isSetLogged(set)} onclick={() => openSetSheet(ex.id, i, false)}>
									<span class="label">Set {set.set_number}</span>
									<span class="value">{isSetLogged(set) ? `${set.weight}${unit}` : hist ? `${hist.weight}${unit}` : '-'}</span>
									<span class="reps">{isSetLogged(set) ? `× ${set.reps}` : hist ? `× ${hist.reps}` : '-'}</span>
								</button>
							{/each}
							<button class="set-chip" onclick={() => addSet(ex.id)} aria-label="Add set">
								<span class="label">Add</span>
								<span class="value" style="color:var(--accent);">+</span>
							</button>
						</div>
						<div class="ex-volume">Total Volume: {formatNumber(exerciseVolume(ex))}{unit}</div>
					</div>
				{/each}

				<button class="btn ghost" onclick={openAddSheet}><Plus size={18} /> Add exercise</button>
				<div style="height:12px"></div>
				<button class="btn danger-ghost" onclick={() => (endSheet = true)}>End workout</button>
				<div style="height:12px"></div>
			</div>
		</div>

		<div class="mode-session" class:hidden={mode !== 'focus'}>
			<div class="focus-wrap">
				{#if currentEx}
					<div class="focus-card">
						<div class="focus-ex-name">{currentEx.name}</div>
						<div class="focus-ex-meta">{currentEx.muscle_primary || currentEx.tool} · Set {focusSet ? focusSet.set.set_number : currentEx.sets.length + 1} of {currentEx.sets.length}</div>
						<div class="focus-set-num">
							{#if focusSet}
								<span class="big">{focusSet.set.set_number}</span>
							{:else}
								<span class="big" style="font-size:34px;">done</span>
							{/if}
						</div>
						<div class="focus-started">Started {formatTimeOfDay(new Date(active.value.started_at))} · elapsed {formatClockMinSec(elapsedSec)}</div>
						<div class="focus-row">
							<div class="chip">
								<span class="label">Reps</span>
								<span class="value" class:ghost={focusLast}>{focusSet ? (focusLast ? focusLast.reps : '—') : '—'}</span>
							</div>
							<div class="chip">
								<span class="label">Weight</span>
								<span class="value" class:ghost={focusLast}>{focusSet ? (focusLast ? focusLast.weight : '—') : '—'}</span>
							</div>
						</div>
						<div class="focus-actions">
							{#if focusSet}
								<button class="btn primary" onclick={() => openSetSheet(currentEx.id, focusSet.index, true)}><Check size={18} /> Finish set</button>
								<button class="btn ghost" onclick={removeCurrentSet}>Delete set</button>
							{:else}
								<button class="btn primary" onclick={() => addSet(currentEx.id)}><Plus size={18} /> Add set</button>
							{/if}
						</div>
					</div>
					<div style="height:12px"></div>
					<button class="btn danger-ghost" onclick={() => (endSheet = true)}>End workout</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Log set -->
<Sheet open={setSheet !== null} title="Log set" onclose={() => (setSheet = null)}>
	<div style="display:flex;gap:12px;">
		<div class="field" style="flex:1;">
			<label for="set-reps">Reps</label>
			<input id="set-reps" type="number" inputmode="decimal" placeholder={setSheetHistory ? setSheetHistory.reps : ''} bind:value={reps} />
		</div>
		<div class="field" style="flex:1;">
			<label for="set-weight">Weight ({unit})</label>
			<input id="set-weight" type="number" inputmode="decimal" placeholder={setSheetHistory ? setSheetHistory.weight : ''} bind:value={weight} />
		</div>
	</div>
	<button class="btn primary" onclick={saveSet}>Save set</button>
</Sheet>

<!-- Add exercise -->
<Sheet open={addView !== null} title="Add exercise" subtitle={addView === 'adhoc' ? 'SESSION ONLY' : undefined} onclose={() => (addView = null)}>
	{#if addView === 'library'}
		<div class="search"><span class="ic"><Search size={18} /></span><input placeholder="Search library..." bind:value={sessionSearch} /></div>
		{#if libFiltered.length === 0}
			<div class="empty" style="padding:30px 10px;">No exercises found. Add one in Exercises first.</div>
		{:else}
			{#each libFiltered as ex (ex.id)}
				<button class="list-row" onclick={() => addFromLibrary(ex)}>
					<div class="thumb">{#if ex.image_url}<img src={ex.image_url} alt="" />{:else}<span class="ic">{ex.emoji || '🏋'}</span>{/if}</div>
					<div class="info">
						<div class="t">{ex.name}</div>
						<div class="m">{ex.muscle_primary} · {ex.tool}</div>
					</div>
					{#if inSession.has(ex.id)}
						<div class="dim" style="font-size:12px;">Added</div>
					{:else}
						<span class="icon-btn" style="pointer-events:none;" aria-hidden="true"><Plus size={18} /></span>
					{/if}
				</button>
			{/each}
		{/if}
		<div style="height:8px"></div>
		<button class="btn ghost" onclick={() => (addView = 'adhoc')}><Plus size={18} /> New session-only exercise</button>
	{:else}
		<div class="field"><label for="adhoc-name">Name</label><input id="adhoc-name" placeholder="e.g. Landmine Press" bind:value={adhocName} /></div>
		<div class="field">
			<label for="adhoc-tool">Tool</label>
			<select id="adhoc-tool" bind:value={adhocTool}>
				<option>Barbell</option><option>Dumbbell</option><option>Cable</option><option>Machine</option><option>Bodyweight</option><option>Other</option>
			</select>
		</div>
		<button class="btn primary" onclick={addAdHocExercise}>Add to session</button>
		<div style="height:8px"></div>
		<div class="dim" style="font-size:12px;text-align:center;">Won't be added to your exercise library.</div>
		<div style="height:8px"></div>
		<button class="btn ghost" onclick={() => (addView = 'library')}>Back to library</button>
	{/if}
</Sheet>

<!-- End workout -->
<Sheet open={endSheet} title="End workout" onclose={() => (endSheet = false)}>
	<div style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:var(--sp-4);">
		{active.value.workout_name} will be saved to your calendar with all details.
	</div>
	<div class="row" style="cursor:default;"><div class="row-head"><div class="row-name" style="font-size:14px;">Workout</div><div class="dim">{active.value.workout_name}</div></div></div>
	<div class="row" style="cursor:default;"><div class="row-head"><div class="row-name" style="font-size:14px;">Plan</div><div class="dim">{active.value.plan_name}</div></div></div>
	<div class="row" style="cursor:default;"><div class="row-head"><div class="row-name" style="font-size:14px;">Duration</div><div class="dim" style="font-variant-numeric:tabular-nums;">{formatDuration(elapsedSec)}</div></div></div>
	<div class="row" style="cursor:default;"><div class="row-head"><div class="row-name" style="font-size:14px;">Volume</div><div class="dim" style="font-family:var(--display);font-variant-numeric:tabular-nums;">{formatNumber(totalVolume())} {unit}</div></div></div>
	<div class="row" style="cursor:default;"><div class="row-head"><div class="row-name" style="font-size:14px;">Sets</div><div class="dim">{totalLoggedSets()}</div></div></div>
	<button class="btn primary" onclick={saveWorkout}>Save workout</button>
	<div style="height:8px"></div>
	<button class="btn ghost" onclick={() => (endSheet = false)}>Keep going</button>
	<div style="height:8px"></div>
	<button class="btn danger-ghost" onclick={discard}>Discard workout</button>
</Sheet>

<!-- Rest overlay -->
{#if restOpen}
	<div class="overlay active">
		<div class="rest-label">Rest time</div>
		<div class="rest-timer">{formatClockMinSec(restElapsed)}</div>
		<div class="rest-next">{currentEx ? `Next: Set ${focusSet ? focusSet.set.set_number : ''} · ${currentEx.name}` : ''}</div>
		<button class="btn primary" onclick={() => (restOpen = false)}>Ready for next set</button>
	</div>
{/if}
