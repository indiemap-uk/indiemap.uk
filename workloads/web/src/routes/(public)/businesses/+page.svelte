<script lang="ts">
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
        <a href={`/business/${business.id}`}>{business.name}</a>
        {#if business.town}
          in <a href={`/town/${business.town?.id}`}>{business.town?.name}, {business.town?.county}</a>
        {/if}
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
