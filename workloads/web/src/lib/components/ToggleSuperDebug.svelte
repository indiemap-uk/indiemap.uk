<script lang="ts">
import {browser} from '$app/environment'
import SuperDebug from 'sveltekit-superforms'

const {data}: {data: any} = $props()

let showDebug = $state(false)

$effect(() => {
  if (browser) {
    showDebug = !!window.localStorage.getItem('superdebug')
  }
})

const toggleDebug = () => {
  if (browser) {
    if (showDebug) {
      window.localStorage.removeItem('superdebug')
    } else {
      window.localStorage.setItem('superdebug', '1')
    }
    showDebug = !showDebug
  }
}
</script>

{#if browser}
  {#if showDebug}
    <div class="mt-2">
      <SuperDebug {data} />
    </div>
  {/if}

  <p style="text-align: right;">
    <a href="#" onclick={toggleDebug}>
      <small>{showDebug ? 'Hide' : 'Show'} SuperDebug</small>
    </a>
  </p>
{/if}
