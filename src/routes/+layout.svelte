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

	ensureSeed();

	let { children } = $props();

	onMount(() => {
		const splash = document.getElementById('boot-splash');
		if (!splash) return;
		splash.classList.add('hide');
		setTimeout(() => splash.remove(), 400);
	});
</script>

<div class="app">
	{@render children()}
	<Nav />
</div>
<Toast />
