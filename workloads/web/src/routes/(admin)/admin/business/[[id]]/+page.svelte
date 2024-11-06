<script lang="ts">
	import BusinessForm from '$lib/business/BusinessForm.svelte'
	import {superForm} from 'sveltekit-superforms'

	const {data} = $props()
	const {message} = superForm(data.businessForm)
</script>

{#if $message}
	<h2>{$message}</h2>
{/if}

<BusinessForm sForm={data.businessForm} town={data.business?.town} />
