<script lang="ts">
	import {browser} from '$app/environment'
	import {useTownSearch} from '$lib/api/townQuery.js'
	import BusinessForm from '$lib/business/BusinessForm.svelte'
	import SuperDebug, {superForm} from 'sveltekit-superforms'

	const {data} = $props()
	const {form, message} = superForm(data.form)
	const {townQuery, townSearchFilter} = useTownSearch()
</script>

<svelte:head>
	<title>Add a business</title>
</svelte:head>

{#if data.business?.id}
	<h1 class="title">Edit {data.business.name}</h1>
{:else}
	<h1 class="title">Add a business</h1>
{/if}

<BusinessForm
	sForm={data.form}
	isError={$townQuery.isError}
	isLoading={$townQuery.isLoading}
	isSuccess={$townQuery.isSuccess}
	towns={$townQuery.data ?? []}
	{townSearchFilter}
/>

{#if browser && window.localStorage.getItem('superdebug')}
	<div class="block">
		<SuperDebug data={$form} />
	</div>
{/if}
