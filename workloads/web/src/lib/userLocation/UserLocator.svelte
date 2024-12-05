<script lang="ts">
	const {onLocate}: {onLocate: (lat: number, lon: number) => void} = $props()
	import {tryLocate} from './tryLocate.js'

	const geoAvailable = 'geolocation' in navigator
</script>

<button
	class="button"
	data-button-size="small"
	data-button-variant="primary"
	disabled={!geoAvailable}
	onclick={() => tryLocate(onLocate)}
>
	<span>Search near me</span>
</button>
