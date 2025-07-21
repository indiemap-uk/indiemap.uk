<script lang="ts">
const {data} = $props()
</script>

<svelte:head>
  <title>{data.town.name}, {data.town.county} on Indiemap.uk</title>
</svelte:head>

<main class="content | flow">
  <h2>{data.town.name}, {data.town.county}</h2>

  <ul>
    {#await data.businesses}
      Loading...
    {:then businesses}
      {#each businesses as business}
        <li>
          <a href={`/business/${business.id}`}>{business.name}</a>
        </li>
      {/each}
    {/await}
  </ul>
</main>
