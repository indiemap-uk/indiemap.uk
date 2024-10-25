<script lang="ts">
	const {
		data,
	}: {
		data: {
			businesses: {name: string}[]
		}
	} = $props()
</script>

<h1>Welcome</h1>

<h2>Some random records from the database</h2>

{#each data.businesses as business}
	<p>{business.name}</p>
{/each}
