<script lang="ts">
	import BusinessForm from '$lib/business/BusinessForm.svelte'
	import {superForm} from 'sveltekit-superforms'

	const {data} = $props()
	const {message} = superForm(data.form)
	const town = data.town
</script>

<svelte:head>
	<title>Add a business</title>
</svelte:head>

{#if $message}
	<h2>{$message}</h2>
{/if}

{#if data.business?.id}
	<h1 class="title">{data.business.name}</h1>
	<h2 class="subtitle">Edit business</h2>
{:else}
	<h1 class="title">Add a business</h1>
{/if}

<BusinessForm sForm={data.form} town={data.town} />
