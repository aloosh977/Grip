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
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { App } from '@capacitor/app';

	ensureSeed();

	let { children } = $props();

	onMount(async () => {
		const splash = document.getElementById('boot-splash');
		if (splash) {
			splash.classList.add('hide');
			setTimeout(() => splash.remove(), 400);
		}

		// Status Bar setup
		await StatusBar.setBackgroundColor({ color: '#0f0f10' });
		await StatusBar.setStyle({ style: Style.Dark });

		// Back Button listener
		App.addListener('backButton', () => {
			if (window.history.length > 1) {
				window.history.back();
			} else {
				App.exitApp();
			}
		});
	});
</script>

<div class="app">
	{@render children()}
	<Nav />
</div>
<Toast />
