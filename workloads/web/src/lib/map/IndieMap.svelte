<script lang="ts">
	import {browser} from '$app/environment'
	import {getUserLocationContext} from '$lib/userLocation/userLocationState.svelte'
	import type {BusinessResolvedType} from '@i/core/business'
	import {MapLibre, NavigationControl, DefaultMarker, Popup, Marker} from 'svelte-maplibre'
	// Center of UK picked from:
	// https://en.wikipedia.org/wiki/Centre_points_of_the_United_Kingdom > Great Britain (mainland only)
	const cetnerOfUK = {lon: -2.421975, lat: 53.825564}

	const userLocationState = getUserLocationContext()

	const center = $derived.by(() =>
		userLocationState.location
			? {lat: userLocationState.location.latitude, lon: userLocationState.location.longitude}
			: cetnerOfUK,
	)
	const zoom = $derived(userLocationState.location ? 10 : 6)

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
