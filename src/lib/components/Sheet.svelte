<script>
	import { X } from '@lucide/svelte';

	let { open, title, subtitle, onclose, children } = $props();
</script>

{#if open}
	<div
		class="sheet-scrim active"
		role="presentation"
		onclick={onclose}
		onkeydown={(e) => e.key === 'Escape' && onclose()}
	></div>
	<div class="sheet active" role="dialog">
		<div class="handle"></div>
		<div class="sheet-head">
			<h3>{title}{#if subtitle}<span class="sheet-subtitle">{subtitle}</span>{/if}</h3>
			<button class="sheet-cancel" onclick={onclose}><X size={18} /></button>
		</div>
		<div class="sheet-body">
			{@render children?.()}
		</div>
	</div>
{/if}
