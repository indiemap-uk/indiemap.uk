<script lang="ts">
	import {description} from 'valibot'

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
				<th></th>
				<th>NAME</th>
				<th>TOWN</th>
				<th>DESCRIPTION</th>
			</tr>
		</thead>
		<tbody>
			{#each data.businesses as business}
				<tr>
					<td class="is-family-monospace">
						<a href={`/admin/business/${business.id.toString()}`}>
							<abbr title={business.id.toString()}>
								{business.id.toString().substring(business.id.toString().length - 5)}
							</abbr>
						</a>
					</td>
					<td>{business.name}</td>
					<td>{business.townId}</td>
					<td>{business.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
