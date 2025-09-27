<script lang="ts">
import BusinessLink from '$lib/business/BusinessLink.svelte'
import CountyLink from '$lib/county/CountyLink.svelte'

const {data} = $props()
</script>

<svelte:head>
  <title>{data.town.name}, {data.town.county} on Indiemap.uk</title>
</svelte:head>

<main class="content | flow">
  <h2>{data.town.name}, <CountyLink name={data.town.county} /></h2>

  <ul>
    {#each data.businesses as business}
      <li>
        <BusinessLink {business} />
      </li>
    {/each}
  </ul>
</main>
