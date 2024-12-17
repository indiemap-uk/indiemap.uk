<script lang="ts">
	import {browser} from '$app/environment'
	import {getMapCenterContext} from '$lib/map/mapCenterState.svelte'
	import type {BusinessResolvedType} from '@i/core/business'
	import {MapLibre, Marker, NavigationControl, Popup} from 'svelte-maplibre'
	import {boundsOfUK, centerOfUK} from './UK'

	const mapCenterState = getMapCenterContext()

	const center = $derived.by(() =>
		mapCenterState.location
			? {lat: mapCenterState.location.latitude, lon: mapCenterState.location.longitude}
			: centerOfUK,
	)

	const zoom = $derived(mapCenterState.location ? 10 : 6)

	const {businesses}: {businesses: Promise<BusinessResolvedType[]>} = $props()

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
	{center}
	{zoom}
	class="map"
	standardControls={false}
	style={mapStyle}
>
	<NavigationControl position="top-left" showCompass={false} />
	{#await businesses then business}
		{#each business as business}
			<Marker lngLat={[business.town.longitude, business.town.latitude]} class="_marker">
				<Popup>
					<div class="_popup">{business.name}</div>
				</Popup>
			</Marker>
		{/each}
	{/await}
</MapLibre>

<style>
	:global(.map) {
		/* z-index: otherwise the control buttons (+/-) would draw over other elements, e.g. select dropdowns */
		z-index: 0;
		height: 500px;
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
