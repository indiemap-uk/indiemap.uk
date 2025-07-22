<script lang="ts">
const {children} = $props()
</script>

<svelte:head>
  <title>Indiemap</title>
  <!-- Cabin visitor analitycs -->
  <script async defer src="https://scripts.withcabin.com/hello.js"></script>
</svelte:head>

<header class="content">
  <h1 class="color-1"><a href="/" class="plain">Indiemap</a></h1>
</header>

{@render children()}

<footer class=""></footer>
