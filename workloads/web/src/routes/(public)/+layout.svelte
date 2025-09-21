<script lang="ts">
const {children} = $props()
</script>

<svelte:head>
  <title>Indiemap</title>
  <!-- Cabin visitor analitycs -->
  <script async defer src="https://scripts.withcabin.com/hello.js"></script>
</svelte:head>

<div class="layout">
  <header class="content">
    <h1 class="color-1"><a href="/" class="plain">Indiemap</a></h1>
    <h3>Discover wonderful indie products and businesses across the UK</h3>
  </header>

  {@render children()}

  <footer class="footer content">
    <p>
      Indiemap is a free, non-profit and <a
        rel="noopener noreferrer"
        target="_blank"
        href="https://github.com/indiemap-uk/indiemap.uk"
      >open-source</a> project to promote small UK retail businesses.

      <a
        rel="noopener noreferrer"
        target="_blank"
        href="https://tally.so/r/waVdeW"
      >Get in touch</a>. Made in Brentwood, Essex ✌️
    </p>
  </footer>
</div>
