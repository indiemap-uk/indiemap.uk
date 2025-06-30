<script lang="ts">
import {MapCenterState, setMapCenterContext} from '$lib/map/mapCenterState.svelte.js'
import SignOutBar from '$lib/user/SignOutBar.svelte'

const {children, data} = $props()

const userLocation = new MapCenterState()
setMapCenterContext(userLocation)
</script>

<svelte:head>
  <title>Indiemap</title>
  <!-- Cabin visitor analitycs -->
  <script async defer src="https://scripts.withcabin.com/hello.js"></script>
</svelte:head>

<div class="sticky-3 | min-vh-100 px-3">
  <header class="caged left-right level | w-100 mx-a">
    <h1 class=""><a href="/" class="passive">Indiemap</a></h1>

    {#if data.session}
      <SignOutBar
        name={data.session?.user.name ?? data.session?.user.email}
        image={data.session?.user.image ?? data.session?.user.libravatar}
      />
    {/if}
  </header>

  <!-- Center the content in a resticted width -->
  <main class="caged | w-100 mx-a">
    {@render children()}
  </main>

  <footer class="footer">
    <p><strong>Indiemap.uk</strong></p>
    <p><span class="">Made in Brentwood, Essex ✌️</span></p>
  </footer>
</div>

<style>
header {
	margin-block: 3rem;
}
</style>
