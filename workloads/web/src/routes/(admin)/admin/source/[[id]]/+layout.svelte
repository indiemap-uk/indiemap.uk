<script lang="ts">
const {children, data} = $props()
</script>

<svelte:head>
  <title>Source</title>
</svelte:head>

{#if data.source?.id}
  <h1 class="title"><span class="tag is-info">Edit</span> Source {data.source.id}</h1>
{:else}
  <h1 class="title">Add a source</h1>
{/if}

{@render children()}
