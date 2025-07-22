<script lang="ts">
const {data} = $props()
</script>

<svelte:head>
  <title>{data.business.name} on Indiemap.uk</title>
</svelte:head>

<main class="content | flow">
  <main class="flow">
    <h2>{data.business.name}</h2>

    {#if data.business.town}
      <p>
        Based in <a href={`/town/${data.business.town.id}`}>{data.business.town.name}, {data.business.town.county}</a>
      </p>
    {/if}

    <p class="prose-width">{data.business.description}</p>
  </main>

  <section>
    {#if data.links.length > 0}
      <h3>Links</h3>
    {/if}
    <ul>
      {#each data.links as link}
        <li>
          <a href={link.url} target="_blank" rel="noreferer noopener">{link.label.length ? link.label : link.url}</a>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    {#if data.locations.length > 0}
      <h3>Locations</h3>
    {/if}
    <ul>
      {#each data.locations as location}
        {#if location.label}
          <li>
            {location.label}
          </li>
        {/if}
      {/each}
    </ul>
  </section>
</main>
