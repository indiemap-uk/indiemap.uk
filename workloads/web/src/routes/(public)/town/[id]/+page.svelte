<script lang="ts">
	import IndieMap from '$lib/map/IndieMap.svelte'

	const {data} = $props()
</script>

<svelte:head>
	<title>{data.town.name} on Indiemap.uk</title>
</svelte:head>

<div class="split">
	<div>
		<h2>{data.town.name} ({data.town.county})</h2>

		<ul>
			{#await data.businesses}
				Loading...
			{:then businesses}
				{#each businesses as business}
					<li>
						<a href={`/business/${business.id}`}>{business.name}</a>
					</li>
				{/each}
			{/await}
		</ul>
	</div>
	<div>
		<IndieMap points={[{lat: data.town.latitude, lon: data.town.longitude, label: data.town.name}]} />
	</div>
</div>

<style>
	ul {
		list-style-type: none;
		padding: 0;
	}
</style>
