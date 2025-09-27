<script lang="ts">
import BusinessLink from '$lib/business/BusinessLink.svelte'

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
        <BusinessLink {business} />
      </li>
    {/each}
  </ul>
</main>
