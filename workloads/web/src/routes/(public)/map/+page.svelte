<script lang="ts">
	import {page} from '$app/stores'
	import IndieMap from '$lib/map/IndieMap.svelte'
	import TownSearch from '$lib/town/TownSearch.svelte'
	import UserLocator from '$lib/userLocation/UserLocator.svelte'
	import {getFlash} from 'sveltekit-flash-message'

	const {data} = $props()

	const flash = getFlash(page)

	const mapMap = new Map([
		['England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'],
		['Scotland', '🏴󠁧󠁢󠁳󠁣󠁴󠁿'],
		['Wales', '🏴󠁧󠁢󠁷󠁬󠁳󠁿'],
	])
</script>

{#if $flash}
	<div class="notification">{$flash.message}</div>
{/if}

<div class="sticky-2 | h-100">
	<div class="level | gap-3 | _locator">
		<UserLocator />
		or
		<TownSearch />
	</div>

	<div class="split">
		<div class="">
			<h2 class="">The List</h2>

			<!-- When I grow up I want to be a separate component! -->
			<ul>
				{#await data.businesses}
					Loading...
				{:then businesses}
					{#each businesses as business}
						<li>
							{business.name} in {business.town.name}, {business.town.county}
							{mapMap.get(business.town.country) ?? '🇬🇧'}
						</li>
					{/each}
				{/await}
			</ul>
		</div>
		<div>
			<h2>The Map</h2>
			<IndieMap businesses={data.businesses} />
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
