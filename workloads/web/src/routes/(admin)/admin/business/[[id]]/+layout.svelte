<script lang="ts">
	import {page} from '$app/stores'
	const {children, data} = $props()
</script>

<svelte:head>
	<title>Business</title>
</svelte:head>

{#if data.business?.id}
	<h1 class="title"><span class="tag is-info">Edit</span> {data.business.name}</h1>
{:else}
	<h1 class="title">Add a business</h1>
{/if}

<div class="tabs">
	<ul>
		<li class:is-active={!$page.url.pathname.includes('links')}>
			<a href={`/admin/business/${data.business?.id}`}>Business info</a>
		</li>
		{#if data.business}
			<li class:is-active={$page.url.pathname.includes('links')}>
				<a href={`/admin/business/${data.business.id}/links`}>Links</a>
			</li>
		{/if}
	</ul>
</div>

{@render children()}
