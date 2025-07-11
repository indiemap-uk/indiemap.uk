<script lang="ts">
import IndieMap from '$lib/map/IndieMap.svelte'
import MapPinIcon from '@tabler/icons-svelte/icons/map-pin'

const {data} = $props()
</script>

<svelte:head>
  <title>{data.business.name} on Indiemap.uk</title>
</svelte:head>

<h2>{data.business.name}</h2>

<p>{data.business.description}</p>

{#if data.links.length > 0}
  <h3>Links</h3>
{/if}
<ul>
  {#each data.links as link}
    <li>
      <a href={link.url} target="_blank" rel="noreferer noopener">{link.label ?? link.url}</a>
    </li>
  {/each}
</ul>

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
