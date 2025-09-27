<script lang="ts">
import BusinessLink from '$lib/business/BusinessLink.svelte'

const {data} = $props()

const hasMore = data.businesses.length === data.limit
</script>

<svelte:head>
  <title>All Businesses - Indiemap.uk</title>
</svelte:head>

<main class="content">
  <h1>All Businesses</h1>

  <ul>
    {#each data.businesses as business}
      <li>
        <BusinessLink {business} />
      </li>
    {/each}
  </ul>

  <div>
    {#if data.hasPrevious}
      <a href={`/businesses?offset=${data.previousOffset}`}>Previous page</a>
    {/if}
    {#if hasMore}
      <a href={`/businesses?offset=${data.nextOffset}`}>Next page</a>
    {/if}
  </div>
</main>
