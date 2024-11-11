<script lang="ts">
	import LocationsForm from '$lib/locations/LocationsForm.svelte'

	const {data} = $props()
</script>

{#if data.business}
	<LocationsForm businessId={data.business.id} sForm={data.form} />
{/if}
