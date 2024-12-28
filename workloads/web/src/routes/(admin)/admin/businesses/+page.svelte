<script lang="ts">
	const {data} = $props()
</script>

<svelte:head>
	<title>Businesses</title>
</svelte:head>

<div class="block">
	<h1 class="title">Businesses</h1>

	<table class="table is-striped is-hoverable is-fullwidth">
		<thead>
			<tr>
				<th>NAME</th>
				<th>TOWN</th>
				<th>DESCRIPTION</th>
			</tr>
		</thead>
		<tbody>
			{#each data.businesses as business, bidx}
				<tr>
					<td class="is-family-monospace">
						<a href={`/admin/business/${business.id.toString()}`}>
							<strong>{business.name}</strong>
						</a>
					</td>
					<td>
						{#if business.town}
							{business.town.name}, {business.town.county}
						{:else}
							<em>-</em>
						{/if}
					</td>
					<td>{business.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
