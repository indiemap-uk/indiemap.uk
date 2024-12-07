<script lang="ts">
	import Autocomplete from '$lib/autocomplete/Autocomplete.svelte'
	import {type TownSearchResultType} from '@i/core/town'
	import {getMapCenterContext} from '$lib/map/mapCenterState.svelte'

	const userLocationState = getMapCenterContext()

	const townOptionRenderer = (i: object, selectionSection?: boolean, inputValue?: string) => {
		if (!(i as TownSearchResultType).name) return 'Type to search...'
		return `${(i as TownSearchResultType).name}, ${(i as TownSearchResultType).county}`
	}

	const onTownChange = (town: unknown) => {
		userLocationState.location = {
			latitude: (town as TownSearchResultType).latitude,
			longitude: (town as TownSearchResultType).longitude,
		}
	}
</script>

<div class="level gap-3">
	<Autocomplete
		style="--width: var(--size-fluid-10)"
		placeholder="Find near any town in the UK"
		noResultMessage={`Can't find such town in the UK`}
		renderer={townOptionRenderer}
		url="/api/town/search?q=[query]"
		onChange={onTownChange}
	/>
	<!-- <button class="button" data-button-variant="secondary" data-button-size="small">
		<span>Search</span>
	</button> -->
</div>
