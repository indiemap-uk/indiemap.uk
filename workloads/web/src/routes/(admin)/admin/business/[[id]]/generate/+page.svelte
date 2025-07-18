<script lang="ts">
import {superForm} from 'sveltekit-superforms/client'

const {data} = $props()
const {form, enhance, submitting} = superForm(data.form)
</script>

<p>Generate a business from a list of URLs</p>
<p>This will create a new Source from these URLs and process it into a Business</p>
<br />

<form method="POST" use:enhance class="admin">
  <div>
    <label for="urls">URLs</label>
    <div>
      <textarea
        bind:value={$form.urls}
        name="urls"
        placeholder="Enter URLs (one per line)"
        rows="5"
      ></textarea>
    </div>
  </div>

  <div>
    <div>
      <button type="submit" disabled={$submitting}>
        {#if $submitting}
          Generating...
        {:else}
          Generate Business
        {/if}
      </button>
    </div>
  </div>
</form>
