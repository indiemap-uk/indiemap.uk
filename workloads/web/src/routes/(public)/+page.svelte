<script lang="ts">
	import {debouncedSearchTowns} from '$lib/town/searchTowns'
	import * as algolia from '@algolia/autocomplete-js'
	import '@algolia/autocomplete-theme-classic'
	import {onMount} from 'svelte'

	onMount(() => {
		algolia.autocomplete({
			container: '#search',
			placeholder: 'What are you looking for?',
			getSources() {
				return [
					// Towns
					{
						sourceId: 'towns',
						getItems({query}) {
							if (query.length < 3) {
								return []
							}

							return debouncedSearchTowns(query)
						},
						getItemInputValue({item}) {
							return `${item.name} in ${item.county}`
						},
						templates: {
							item({item}) {
								return `${item.name} in ${item.county}`
							},
							noResults() {
								return 'No results'
							},
						},
					},
				]
			},
		})
		// }
	})
</script>

<div class="caged">
	<div id="search"></div>
</div>

<style>
	.caged > div {
		margin-inline: auto;
	}
</style>
