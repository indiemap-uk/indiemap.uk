<script lang="ts">
	import {browser} from '$app/environment'
	import {getMapCenterContext} from '$lib/map/mapCenterState.svelte'
	import {MapLibre, Marker, NavigationControl, Popup} from 'svelte-maplibre'
	import {boundsOfUK, centerOfUK} from './UK'

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

	$inspect({mapCenter})

	const prefersDarkMode = browser && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

	const mapStyle = prefersDarkMode
		? 'https://tiles.openfreemap.org/styles/dark'
		: 'https://tiles.openfreemap.org/styles/positron'
</script>

<MapLibre
	minPitch={0}
	maxPitch={0}
	dragRotate={false}
	maxBounds={boundsOfUK}
	center={mapCenter}
	{zoom}
	class="map"
	standardControls={false}
	style={mapStyle}
>
	<NavigationControl position="top-left" showCompass={false} />
	{#each points as point}
		<Marker lngLat={[point.lon, point.lat]} class="_marker">
			<Popup>
				<div class="_popup">{point.label}</div>
			</Popup>
		</Marker>
	{/each}
</MapLibre>

<style>
	:global(.map) {
		/* z-index: otherwise the control buttons (+/-) would draw over other elements, e.g. select dropdowns */
		z-index: 0;
		height: 600px;
	}

	._popup {
		font-weight: var(--font-weight-2);
		color: var(--primary-color-ink);
	}

	:global(._marker) {
		width: 20px;
		height: 20px;
		background-color: var(--primary-color-ink);
		border-radius: 50%;
	}

	:global(._marker::before) {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 15px solid var(--primary-color-ink);
	}
</style>
