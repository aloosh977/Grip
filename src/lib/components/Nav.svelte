<script>
	import { House, Calendar, Play, ClipboardList, Dumbbell } from '@lucide/svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { active } from '$lib/sessionStore.svelte.js';

	const path = $derived(page.url.pathname);
	const hasSession = $derived(active.value !== null);
	const current = $derived.by(() => {
		if (path.startsWith('/plans')) return 'plans';
		if (path.startsWith('/calendar')) return 'calendar';
		if (path.startsWith('/start')) return 'start';
		if (path.startsWith('/exercises')) return 'exercises';
		return 'home';
	});

	function onStart() {
		goto(hasSession ? '/session' : '/start');
	}
</script>

<nav class="nav">
	<button class="tab" class:active={current === 'home'} onclick={() => goto('/')}>
		<House size={20} />
		<span>Home</span>
	</button>
	<button class="tab" class:active={current === 'calendar'} onclick={() => goto('/calendar')}>
		<Calendar size={20} />
		<span>Calendar</span>
	</button>
	<button class="tab start-tab" onclick={onStart}>
		<div class="fab"><Play size={22} /></div>
		<span>{hasSession ? 'Return' : 'Start'}</span>
	</button>
	<button class="tab" class:active={current === 'plans'} onclick={() => goto('/plans')}>
		<ClipboardList size={20} />
		<span>Plans</span>
	</button>
	<button class="tab" class:active={current === 'exercises'} onclick={() => goto('/exercises')}>
		<Dumbbell size={20} />
		<span>Exercises</span>
	</button>
</nav>
