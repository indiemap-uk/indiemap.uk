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

  {#if data.business && data.business.products}
    <section>
      {#if data.business.products && data.business.products.length > 0}
        <h3>Products</h3>
      {/if}
      <ul>
        {#each data.business.products as product}
          <li>
            {product.originalName}
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if data.business && data.business.links}
    <section>
      {#if data.business.links?.length > 0}
        <h3>Links</h3>
      {/if}
      <ul>
        {#each data.business.links as link}
          <li>
            <a href={link.url} target="_blank" rel="noreferer noopener">{link.label?.length ? link.label : link.url}</a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if data.business && data.business.locations}
    <section>
      {#if data.business.locations.length > 0}
        <h3>Locations</h3>
      {/if}
      <ul>
        {#each data.business.locations as location}
          {#if location.label}
            <li>
              {location.label}
              {#if location.latitude && location.longitude}
                (<a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >map</a>)
              {/if}
            </li>
          {/if}
        {/each}
      </ul>
    </section>
  {/if}
</main>
