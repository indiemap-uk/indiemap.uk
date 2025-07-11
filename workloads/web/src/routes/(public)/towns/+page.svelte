<script lang="ts">
const {data} = $props()

const hasMore = data.towns.length === data.limit
</script>

<svelte:head>
  <title>All Towns - Indiemap.uk</title>
</svelte:head>

<main>
  <h1>All Towns</h1>

  <ul>
    {#each data.towns as town}
      <li>
        <a href={`/town/${town.id}`}>{town.name}, {town.county}</a> ({town.businessCount})
      </li>
    {/each}
  </ul>

  <div>
    {#if data.hasPrevious}
      <a href={`/towns?offset=${data.previousOffset}`}>Previous page</a>
    {/if}
    {#if hasMore}
      <a href={`/towns?offset=${data.nextOffset}`}>Next page</a>
    {/if}
  </div>
</main>
