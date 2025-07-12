<script lang="ts">
import {SourceCreateSchema, SourceSchema} from '@i/core/source'
import {superForm} from 'sveltekit-superforms'
import {valibot} from 'sveltekit-superforms/adapters'

const {sForm, business} = $props()

const {form, errors, enhance, submitting, message} = superForm(sForm, {
  validators: valibot(sForm.data.id ? SourceSchema : SourceCreateSchema),
})

// Convert URLs array to string for textarea
const urlsText = $derived($form.urls?.join('\n') ?? '')

// Update form when textarea changes
function handleUrlsChange(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const urls = target.value
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)

  $form.urls = urls
}
</script>

<form method="POST" action="?/{$form.id ? 'update' : 'create'}" use:enhance>
  {#if $form.id}
    <input type="hidden" name="id" value={$form.id} />
  {/if}

  {#if business}
    <div class="field">
      <label class="label" for="business">Business</label>
      <div class="control">
        <input
          id="business"
          class="input"
          type="text"
          value={business.name}
          readonly
          disabled
        />
      </div>
      <p class="help">This field cannot be edited</p>
    </div>
  {/if}

  <div class="field">
    <label class="label" for="urls">URLs</label>
    <div class="control">
      <textarea
        id="urls"
        name="urls"
        class="textarea"
        class:is-danger={$errors.urls}
        placeholder="Enter URLs (one per line)"
        rows="8"
        value={urlsText}
        oninput={handleUrlsChange}
        required
      ></textarea>
    </div>
    {#if $errors.urls}
      <p class="help is-danger">{$errors.urls}</p>
    {/if}
  </div>

  <div class="field is-grouped">
    <div class="control">
      <button class="button is-primary" type="submit" disabled={$submitting}>
        {#if $submitting}
          {$form.id ? 'Updating...' : 'Creating...'}
        {:else}
          {$form.id ? 'Update Source' : 'Create Source'}
        {/if}
      </button>

      {#if !$form.id}
        <button
          class="button is-info"
          type="submit"
          formaction="?/generate"
          disabled={$submitting}
        >
          Generate from the 1st URL
        </button>
      {/if}
    </div>

    <div class="control">
      <a href="/admin/sources" class="button is-light">Cancel</a>
    </div>

    {#if $form.id}
      <div class="control">
        <button
          class="button is-danger"
          type="submit"
          formaction="?/delete"
          disabled={$submitting}
          onclick={() => confirm('Are you sure you want to delete this source?')}
        >
          Delete
        </button>
      </div>
    {/if}
  </div>

  {#if $message}
    <div class="notification is-success">
      {$message}
    </div>
  {/if}
</form>
