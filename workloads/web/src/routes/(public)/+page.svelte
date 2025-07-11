<script lang="ts">
const {data} = $props()
</script>

<svelte:head>
  <title>Indiemap.uk</title>
</svelte:head>

<main>
  <h2>Latest</h2>
  <ul>
    {#await data.latestBusinesses then business}
      {#each business as business}
        <li>
          <a href={`/business/${business.id}`}>{business.name}</a>
          {#if business.town}
            in <a href={`/town/${business.town?.id}`}>{business.town?.name}, {business.town?.county}</a>
          {/if}
        </li>
      {/each}
    {/await}
  </ul>
  <p><a href="/businesses">All businesses</a></p>

  <h2>Top Towns</h2>
  <ul>
    {#await data.townsWithBusiness then towns}
      {#each towns as town}
        <li>
          <a href={`/town/${town.id}`}>{town.name}, {town.county}</a> ({town.businessCount})
        </li>
      {/each}
    {/await}
  </ul>
  <p><a href="/towns">All towns</a></p>
</main>
