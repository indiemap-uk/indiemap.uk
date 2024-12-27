<script lang="ts">
	import {browser} from '$app/environment'
	import {getMapCenterContext} from '$lib/map/mapCenterState.svelte'
	import {boundsOfUK, centerOfUK} from './UK'
	import {MediaQuery} from 'svelte/reactivity'

	const isTouchDevice = new MediaQuery('pointer: coarse')

	const loadMaplibre = async () => import('svelte-maplibre')

	const {
		points,
		center,
		zoom = 5,
	}: {
		center?: {lon: number; lat: number}
		points: Array<{lon: number; lat: number; label: string}>
		zoom?: number
	} = $props()

	const mapCenterState = getMapCenterContext()

	const mapCenter = $derived.by(() => {
		if (center) {
			return {
				lat: center.lat,
				lon: center.lon,
			}
		}

		if (mapCenterState.location) {
			return {
				lat: mapCenterState.location.latitude,
				lon: mapCenterState.location.longitude,
			}
		}

		if (points.length === 1) {
			return {
				lat: points[0].lat,
				lon: points[0].lon,
			}
		}

		return centerOfUK
	})

	const prefersDarkMode = browser && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

	const mapStyle = prefersDarkMode
		? 'https://tiles.openfreemap.org/styles/dark'
		: 'https://tiles.openfreemap.org/styles/positron'
</script>

{#await loadMaplibre() then svelteMaplibre}
	<!-- See $lib/css/map.css -->
	<svelteMaplibre.MapLibre
		cooperativeGestures={isTouchDevice.current}
		minPitch={0}
		maxPitch={0}
		dragRotate={false}
		maxBounds={boundsOfUK as [number, number, number, number]}
		center={mapCenter}
		{zoom}
		standardControls={false}
		style={mapStyle}
	>
		<svelteMaplibre.NavigationControl position="top-left" showCompass={false} />
		{#each points as point}
			<svelteMaplibre.Marker lngLat={[point.lon, point.lat]} class="map_marker">
				<svelteMaplibre.Popup>
					<div class="map_popup">{point.label}</div>
				</svelteMaplibre.Popup>
			</svelteMaplibre.Marker>
		{/each}
	</svelteMaplibre.MapLibre>
{/await}
