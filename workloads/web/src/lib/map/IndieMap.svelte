<script lang="ts">
	import {getUserLocationContext} from '$lib/userLocation/userLocationState.svelte'

	const userLocationState = getUserLocationContext()
</script>

{#if userLocationState.location}
	<p>{JSON.stringify(userLocationState.location)}</p>
{:else}
	<p>no location</p>
{/if}
