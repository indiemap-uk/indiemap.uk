<script lang="ts">
	import LinksForm from '$lib/links/LinksForm.svelte'

	const {data} = $props()
</script>

{#if data.business}
	<LinksForm sForm={data.form} businessId={data.business.id} />
{/if}
