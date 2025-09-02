<script lang="ts">
const {data} = $props()
</script>

<svelte:head>
  <title>Sources</title>
</svelte:head>

<h1>Cache</h1>

<form action="?/clear" method="post">
  <button type="submit">Clear all caches</button>
</form>
