<script lang="ts">
import CountyLink from '$lib/county/CountyLink.svelte'

const {data} = $props()
</script>

<svelte:head>
  <title>Counties - Indiemap.uk</title>
</svelte:head>

<main class="content | flow">
  <h2>All counties with businesses on Indiemap.uk</h2>

  <ul>
    {#each data.counties as county}
      <li>
        <CountyLink name={county} />
      </li>
    {/each}
  </ul>
</main>
