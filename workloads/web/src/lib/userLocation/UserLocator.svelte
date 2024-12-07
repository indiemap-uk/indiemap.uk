<script lang="ts">
	import {tryLocate} from './tryLocate.js'
	import {getMapCenterContext} from '$lib/map/mapCenterState.svelte.js'

	const userLocationState = getMapCenterContext()

	const geoAvailable = 'geolocation' in navigator
</script>

<button
	class="button"
	data-button-size="small"
	data-button-variant="primary"
	disabled={!geoAvailable}
	onclick={() =>
		tryLocate((lat, lon) => {
			userLocationState.location = {latitude: lat, longitude: lon}
		})}
>
	<span>Search near me</span>
</button>
