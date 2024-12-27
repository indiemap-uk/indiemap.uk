<script lang="ts">
	import IndieMap from '$lib/map/IndieMap.svelte'
	import MapPinIcon from '@tabler/icons-svelte/icons/map-pin'

	const {data} = $props()

	const points = [
		{lat: data.business.town.latitude, lon: data.business.town.longitude, label: data.business.name},
	].concat(
		data.locations.map((location) => ({
			lat: location.latitude,
			lon: location.longitude,
			label: location.label ?? 'n/a',
		})),
	)
</script>

<svelte:head>
	<title>{data.business.name} on Indiemap.uk</title>
</svelte:head>

<div class="split">
	<div>
		<h2>{data.business.name}</h2>
		<p class="location">
			<MapPinIcon size={16} />

			<a href={`/town/${data.business.townId}`}>{data.business.town.name}, {data.business.town.county}</a>
		</p>

		<p>{data.business.description}</p>

		{#if data.links.length > 0}
			<h3>External links</h3>
		{/if}
		<ul>
			{#each data.links as link}
				<li>
					<a href={link.url} target="_blank" rel="noreferer noopener">{link.label ?? link.url}</a>
				</li>
			{/each}
		</ul>

		{#if data.locations.length > 0}
			<h3>Locations</h3>
		{/if}
		<ul>
			{#each data.locations as location}
				{#if location.label}
					<li>
						{location.label}
					</li>
				{/if}
			{/each}
		</ul>
	</div>
	<div>
		<IndieMap {points} center={points[0]} zoom={8} />
	</div>
</div>

<style>
	.location {
		margin-block-end: 1rem;
		display: flex;
		align-items: center;
		gap: 5px;
		color: var(--primary-color-ink);
	}

	ul {
		list-style-type: none;
		padding: 0;
	}
</style>
