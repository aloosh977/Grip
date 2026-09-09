<script>
	import { toast } from '$lib/toast.svelte.js';
</script>

<div class="toast" class:show={toast.show}>{toast.msg}</div>
