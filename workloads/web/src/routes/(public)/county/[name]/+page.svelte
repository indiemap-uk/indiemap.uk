<script lang="ts">
const {data} = $props()
</script>

<svelte:head>
  <title>{data.county} on Indiemap.uk</title>
</svelte:head>

<main class="content | flow">
  <h2>{data.county}</h2>

  <ul>
    {#each data.businesses as business}
      <li>
        <a href={`/business/${business.id}`}>{business.name}</a>
      </li>
    {/each}
  </ul>
</main>
