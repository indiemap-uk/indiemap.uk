<script lang="ts">
	import {alogliaTownSearch} from '$lib/town/algoliaTownSearch'
	import * as algolia from '@algolia/autocomplete-js'
	import '@algolia/autocomplete-theme-classic'
	import {onMount} from 'svelte'

	onMount(() => {
		algolia.autocomplete({
			container: '#search',
			placeholder: 'What are you looking for?',
			getSources() {
				return [alogliaTownSearch]
			},
		})
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
