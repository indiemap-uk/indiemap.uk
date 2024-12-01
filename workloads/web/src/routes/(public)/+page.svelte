<script lang="ts">
	import {page} from '$app/stores'
	import IndieMap from '$lib/map/IndieMap.svelte'
	import TownSearch from '$lib/town/TownSearch.svelte'
	import {getUserLocationContext} from '$lib/userLocation/userLocationState.svelte'
	import UserLocator from '$lib/userLocation/UserLocator.svelte'
	import {getFlash} from 'sveltekit-flash-message'

	const flash = getFlash(page)

	const userLocationState = getUserLocationContext()
	const onLocate = (latitude: number, longitude: number) => {
		userLocationState.location = {latitude, longitude}
	}
</script>

{#if $flash}
	<div class="notification">{$flash.message}</div>
{/if}

<div class="sticky-2 | h-100">
	<div class="level | gap-3 | _locator">
		<UserLocator {onLocate} />
		or
		<TownSearch />
	</div>

	<div class="split">
		<div class="">
			<h2 class="">The List</h2>
			<small>Placeholder: the latest 10 business</small>
		</div>
		<div class="">
			<h2>The Map</h2>
			<IndieMap />
		</div>
	</div>
</div>

<style>
	._locator {
		margin-block-start: 0rem;
		margin-block-end: 3rem;
		margin-inline: auto;
	}
</style>
