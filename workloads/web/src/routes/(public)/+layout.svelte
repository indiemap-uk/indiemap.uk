<script lang="ts">
const {children} = $props()
</script>

<svelte:head>
  <title>Indiemap</title>
  <!-- Cabin visitor analitycs -->
  <script async defer src="https://scripts.withcabin.com/hello.js"></script>
</svelte:head>

<header>
  <h1 class=""><a href="/" class="">Indiemap</a></h1>
</header>

<main class="">
  {@render children()}
</main>

<footer class="footer"></footer>
