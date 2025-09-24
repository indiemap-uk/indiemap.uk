<script lang="ts">
import CountyLink from '$lib/county/CountyLink.svelte'
import TownLink from '$lib/town/TownLink.svelte'

const {data} = $props()
</script>

<svelte:head>
  <title>Indiemap.uk</title>
</svelte:head>

<main class="content | flow flow-lg">
  <section>
    <h2>Latest</h2>
    <ul>
      {#each data.latestBusinesses as business}
        <li>
          <a href={`/business/${business.id}`}>{business.name}</a>
          {#if business.town}
            in <TownLink id={business.town.id} name={business.town.name} />, <CountyLink name={business.town.county} />
          {/if}
        </li>
      {/each}
    </ul>
    <p><a href="/businesses">All businesses</a></p>
  </section>

  <section>
    <h2>Top Towns</h2>
    <ul>
      {#each data.townsWithBusiness as town}
        <li>
          <TownLink id={town.id} name={town.name} />, <CountyLink name={town.county} />
        </li>
      {/each}
    </ul>
    <p><a href="/towns">All towns</a></p>
  </section>
</main>
