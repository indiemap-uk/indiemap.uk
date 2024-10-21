<script lang="ts">
	const {
		data,
	}: {
		data: {
			indies: {name: string}[]
		}
	} = $props()
</script>

<h1>Welcome</h1>

<h2>Some random records from the database</h2>

{#each data.indies as indie}
	<p>{indie.name}</p>
{/each}
