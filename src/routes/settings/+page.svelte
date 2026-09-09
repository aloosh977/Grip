<script>
	import { getSettings, saveSettings, exportAll, importAll, resetAll } from '$lib/db.js';
	import { showToast } from '$lib/toast.svelte.js';

	const OPTIONAL_STATS = [
		{ key: 'totalWorkouts', label: 'Total workouts' },
		{ key: 'bestWeek', label: 'Best week' },
		{ key: 'bestDay', label: 'Best day' },
		{ key: 'volumeDay', label: 'Total volume this day' }
	];
	const WEEK_OPTIONS = [
		{ i: 6, label: 'Sat' },
		{ i: 1, label: 'Mon' },
		{ i: 2, label: 'Tue' },
		{ i: 3, label: 'Wed' },
		{ i: 4, label: 'Thu' },
		{ i: 5, label: 'Fri' },
		{ i: 0, label: 'Sun' }
	];

	let settings = $state(getSettings());

	function persist() {
		saveSettings(settings);
	}

	function toggleStat(key) {
		settings.home_stats = settings.home_stats.includes(key)
			? settings.home_stats.filter((k) => k !== key)
			: [...settings.home_stats, key];
		persist();
	}

	function changeGoal(d) {
		settings.weekly_goal = Math.min(7, Math.max(1, settings.weekly_goal + d));
		persist();
	}

	function setWeekStart(i) {
		settings.week_start = i;
		persist();
	}

	function setUnit(u) {
		settings.unit = u;
		persist();
		showToast(`Unit: ${u}`);
	}

	function exportData() {
		const data = exportAll();
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'gym-backup.json';
		a.click();
		URL.revokeObjectURL(url);
		showToast('Exported — gym-backup.json');
	}

	let fileInput;
	async function onImport() {
		const f = fileInput.files[0];
		if (!f) return;
		try {
			const json = JSON.parse(await f.text());
			if (importAll(json)) {
				showToast('Import complete');
				setTimeout(() => location.reload(), 600);
			} else {
				showToast('Invalid backup file');
			}
		} catch {
			showToast('Could not read file');
		}
		fileInput.value = '';
	}

	let resetConfirm = $state(false);
	function resetAccount() {
		if (!resetConfirm) {
			resetConfirm = true;
			return;
		}
		resetAll();
		showToast('All data reset');
		setTimeout(() => location.reload(), 600);
	}
</script>

<input type="file" accept=".json,application/json" style="display:none" bind:this={fileInput} onchange={onImport} />

<div class="page">
	<div class="topbar"><h1>Settings</h1></div>
	<div class="content">
		<div class="section-title" style="margin-top:6px;"><h2>Home screen</h2></div>
		<div class="setting-item">
			<div class="si-label">Trained this week<small>Default · always shown</small></div>
			<div class="tag-default">Default</div>
		</div>
		<div class="setting-item">
			<div class="si-label">Total volume this week<small>Default · always shown</small></div>
			<div class="tag-default">Default</div>
		</div>
		{#each OPTIONAL_STATS as stat (stat.key)}
			<button class="setting-item" style="width:100%;cursor:pointer;" onclick={() => toggleStat(stat.key)}>
				<div class="si-label">{stat.label}<small>Optional</small></div>
				<div class="chip" class:active={settings.home_stats.includes(stat.key)}>
					{settings.home_stats.includes(stat.key) ? 'On' : 'Off'}
				</div>
			</button>
		{/each}

		<div class="section-title"><h2>Weekly goal</h2></div>
		<div class="setting-item">
			<div class="si-label">Workouts per week<small>Shown on Home &amp; Calendar</small></div>
			<div class="stepper">
				<button onclick={() => changeGoal(-1)} aria-label="Decrease">−</button>
				<div class="val">{settings.weekly_goal}</div>
				<button onclick={() => changeGoal(1)} aria-label="Increase">＋</button>
			</div>
		</div>

		<div class="section-title"><h2>Week starts on</h2></div>
		<div class="chips" style="margin-bottom:var(--sp-4);">
			{#each WEEK_OPTIONS as w (w.i)}
				<button class="chip" class:active={settings.week_start === w.i} onclick={() => setWeekStart(w.i)}>{w.label}</button>
			{/each}
		</div>

		<div class="section-title"><h2>Unit</h2></div>
		<div class="segment">
			<button class="seg" class:active={settings.unit === 'kg'} onclick={() => setUnit('kg')}>kg</button>
			<button class="seg" class:active={settings.unit === 'lb'} onclick={() => setUnit('lb')}>lb</button>
		</div>

		<div class="section-title"><h2>Data</h2></div>
		<button class="row" onclick={exportData}>
			<div class="row-head">
				<div><div class="row-name" style="font-size:14px;">Export data</div><div class="row-meta">Download all your data as JSON</div></div>
			</div>
		</button>
		<button class="row" onclick={() => fileInput.click()}>
			<div class="row-head">
				<div><div class="row-name" style="font-size:14px;">Import data</div><div class="row-meta">Restore from a backup file</div></div>
			</div>
		</button>
		<div class="row" style="cursor:default;">
			<div class="row-head">
				<div><div class="row-name" style="font-size:14px;">About</div><div class="row-meta">Grip v0.1.0</div></div>
			</div>
		</div>

		<div class="version">Grip — Get a grip on your training</div>

		<div class="section-title"><h2>Danger zone</h2></div>
		<button class="btn danger-ghost" onclick={resetAccount}>
			{resetConfirm ? 'Tap again to confirm reset' : 'Reset account'}
		</button>
		<div style="font-size:11px;color:var(--text-3);margin-top:8px;line-height:1.5;">
			Deletes all workouts, plans, exercises and settings on this device. This cannot be undone — export a backup first if you want to keep anything.
		</div>
	</div>
</div>
