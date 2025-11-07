<script lang="ts">
import {signIn} from '@auth/sveltekit/client'

const {data} = $props()
</script>

<div class="container is-fluid has-text-centered">
  <div class="section is-medium">
    <button 
      class="button mx-auto" 
      onclick={() => signIn(undefined, { callbackUrl: '/admin' })}
    >
      Admin Sign In
    </button>
  </div>
</div>
