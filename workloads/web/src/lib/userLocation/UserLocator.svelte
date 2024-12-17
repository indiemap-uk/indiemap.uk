<script lang="ts">
	import {getMapCenterContext} from '$lib/map/mapCenterState.svelte'
	import {tryLocateInUK} from './tryLocateInUK'

	const userLocationState = getMapCenterContext()

	const geoAvailable = 'geolocation' in navigator
</script>

<button
	class="button"
	data-button-size="small"
	data-button-variant="primary"
	disabled={!geoAvailable}
	onclick={() =>
		tryLocateInUK((lat, lon) => {
			userLocationState.location = {latitude: lat, longitude: lon}
		})}
>
	<span>Search near me</span>
</button>
