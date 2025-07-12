<script lang="ts">
import {page} from '$app/state'
const {children, data} = $props()

// Match the URL to an active tab
const activeTab = $derived.by(() => {
  if (page.url.pathname.endsWith('links')) return 'links'
  if (page.url.pathname.endsWith('locations')) return 'locations'
  if (page.url.pathname.endsWith('generate')) return 'generate'
  return 'info'
})
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
    {#if data.business}
      <li class:is-active={activeTab === 'info'}>
        <a href={`/admin/business/${data.business?.id}`}>Business info</a>
      </li>
      <li class:is-active={activeTab === 'links'}>
        <a href={`/admin/business/${data.business.id}/links`}>Links</a>
      </li>
      <li class:is-active={activeTab === 'locations'}>
        <a href={`/admin/business/${data.business.id}/locations`}>Locations</a>
      </li>
    {:else}
      <li class:is-active={activeTab === 'info'}>
        <a href={`/admin/business/`}>Add Business</a>
      </li>
      <li class:is-active={activeTab === 'generate'}>
        <a href={`/admin/business/generate`}>Generate by URLs</a>
      </li>
    {/if}
  </ul>
</div>

{#key data.business?.id ?? 'new'}
  {@render children()}
{/key}
