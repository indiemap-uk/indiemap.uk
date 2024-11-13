<script lang="ts">
	import {getFlash} from 'sveltekit-flash-message'
	import {page} from '$app/stores'

	const flash = getFlash(page)
</script>

{#if $flash}
	<div class="notification">{$flash.message}</div>
{/if}

<h2 class="subtitle">This is the home page</h2>

<style>
	h2 {
		display: grid;
		place-content: center;
		height: 100%;
	}
</style>
