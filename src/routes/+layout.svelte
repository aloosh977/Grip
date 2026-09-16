<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import '@fontsource/archivo-black/latin.css';
	import '@fontsource/inter/latin-400.css';
	import '@fontsource/inter/latin-600.css';
	import '@fontsource/inter/latin-700.css';
	import Nav from '$lib/components/Nav.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { ensureSeed } from '$lib/seed.js';
	import { initNativeSQLite } from '$lib/db.js';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { App } from '@capacitor/app';

	let initialized = $state(false);
	let { children } = $props();

	onMount(async () => {
		await initNativeSQLite();
		ensureSeed();
		initialized = true;

		const splash = document.getElementById('boot-splash');
		if (splash) {
			splash.classList.add('hide');
			setTimeout(() => splash.remove(), 400);
		}

		// Status Bar setup
		try {
			await StatusBar.setBackgroundColor({ color: '#0f0f10' });
			await StatusBar.setStyle({ style: Style.Dark });
		} catch {}

		// Back Button listener
		try {
			App.addListener('backButton', () => {
				if (window.history.length > 1) {
					window.history.back();
				} else {
					App.exitApp();
				}
			});
		} catch {}
	});
</script>

{#if initialized}
	<div class="app">
		{@render children()}
		<Nav />
	</div>
{/if}
<Toast />
