<script lang="ts">
	const {onLocate}: {onLocate: (lat: number, lon: number) => void} = $props()

	const geoAvailable = 'geolocation' in navigator

	const tryLocate = () => {
		if (geoAvailable) {
			navigator.geolocation.getCurrentPosition((position) => {
				onLocate(position.coords.latitude, position.coords.longitude)
			})
		}
	}
</script>

<button
	class="button"
	data-button-size="small"
	data-button-variant="primary"
	disabled={!geoAvailable}
	onclick={tryLocate}
>
	<span>Search near me</span>
</button>
