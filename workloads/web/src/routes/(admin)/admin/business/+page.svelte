<script lang="ts">
	import {description} from 'valibot'

	const {data} = $props()
</script>

<svelte:head>
	<title>Businesses</title>
</svelte:head>

<div class="block">
	<h1 class="title">Businesses</h1>

	<table class="table">
		<thead>
			<tr>
				<th>ID</th>
				<th>NAME</th>
				<th>TOWN</th>
				<th>DESCRIPTION</th>
			</tr>
		</thead>
		<tbody>
			{#each data.businesses as business}
				<tr>
					<td>{business.id}</td>
					<td>{business.name}</td>
					<td>{business.townId}</td>
					<td>{business.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
