<script lang="ts">
	import BusinessForm from '$lib/business/BusinessForm.svelte'
	import {superForm} from 'sveltekit-superforms'

	const {data} = $props()
	const {message} = superForm(data.form)
</script>

<svelte:head>
	<title>Business</title>
</svelte:head>

{#if $message}
	<h2>{$message}</h2>
{/if}

{#if data.business?.id}
	<h1 class="title"><span class="tag is-info">Edit</span> {data.business.name}</h1>
{:else}
	<h1 class="title">Add a business</h1>
{/if}

<BusinessForm sForm={data.form} town={data.business?.town} />
