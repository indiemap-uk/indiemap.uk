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
				<th>STATUS</th>
				<th>NAME</th>
				<th>TOWN</th>
			</tr>
		</thead>
		<tbody>
			{#each data.businesses as business}
				<tr>
					<td>{business.status}</td>
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
				</tr>
			{/each}
		</tbody>
	</table>
</div>
