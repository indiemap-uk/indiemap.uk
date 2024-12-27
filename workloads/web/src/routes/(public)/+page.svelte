<script lang="ts">
	import {alogliaBusinessSearch} from '$lib/business/algoliaBusinessSearch'
	import IndieMap from '$lib/map/IndieMap.svelte'
	import {centerOfUK} from '$lib/map/UK.js'
	import {alogliaTownSearch} from '$lib/town/algoliaTownSearch'
	import * as algolia from '@algolia/autocomplete-js'
	import type {BusinessResolvedType} from '@i/core/business'
	import type {TownSearchResultType} from '@i/core/town'
	import {onMount} from 'svelte'

	const {data} = $props()

	const points = $derived(
		data.businesses.map((business) => ({
			lat: business.town.latitude,
			lon: business.town.longitude,
			label: business.name,
		})),
	)

	onMount(() => {
		algolia.autocomplete<BusinessResolvedType | TownSearchResultType>({
			container: '#search',
			placeholder: 'What are you looking for?',
			// @ts-ignore - not sure how to set multiple sources type-safely
			getSources() {
				return [alogliaBusinessSearch, alogliaTownSearch]
			},
		})
	})
</script>

<div class="caged">
	<div id="search"></div>
</div>

<div class="sticky-2 | h-100">
	<div class="split">
		<div>
			<h2>Latest businesses</h2>

			<ul>
				{#each data.businesses as business}
					<li>
						<a href={`/business/${business.id}`}>{business.name} ({business.town.name}, {business.town.county})</a>
					</li>
				{/each}
			</ul>
		</div>
		<IndieMap {points} center={centerOfUK} />
	</div>
</div>

<style>
	.caged > div {
		margin-inline: auto;
		margin-bottom: 3rem;
	}

	ul {
		list-style: none;
		padding: 0;
	}
</style>
