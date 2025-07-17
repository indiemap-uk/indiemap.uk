<script lang="ts">
import ToggleSuperDebug from '$lib/components/ToggleSuperDebug.svelte'
import {SourceCreateSchema, SourceSchema} from '@i/core/source'
import {IconClipboard} from '@tabler/icons-svelte'
import {arrayProxy, superForm} from 'sveltekit-superforms'
import {valibot} from 'sveltekit-superforms/adapters'

const {sForm, business} = $props()

const superform = superForm(sForm, {
  dataType: 'json',
  invalidateAll: 'force',
})

const {form, enhance, submitting, message, tainted} = superform
const {values: urlsValues, errors: urlsErrors, valueErrors: urlsValueErrors} = arrayProxy(superform, 'urls')
</script>

{#if $message}
  <div>
    {$message}
  </div>
{/if}

<form method="POST" action="?/{$form.id ? 'update' : 'create'}" use:enhance class="admin flow">
  {#if $form.id}
    <input type="hidden" name="id" value={$form.id} />
  {/if}

  {#if business}
    Business: <a href={`/admin/business/${business.id}`}>
      {business.name}
    </a>
  {/if}

  <div>
    <label for="urls">URLs</label>

    {#if $urlsErrors}
      <p>{$urlsErrors}</p>
    {/if}

    {#each $urlsValues as _, i}
      <div class="input-group">
        <button
          title="Paste from clipboard"
          onclick={(e) => {
            e.preventDefault()
            navigator.clipboard.readText().then(text => {
              $urlsValues[i] = text
              $urlsValues = $urlsValues
            })
          }}
        >
          <IconClipboard />
        </button>
        <input
          type="text"
          bind:value={$urlsValues[i]}
          placeholder="Enter URL"
        />
        {#if $urlsValueErrors[i]}
          <span style="color: red;">{$urlsValueErrors[i]}</span>
        {/if}
        <button
          type="button"
          onclick={() => {
            $urlsValues.splice(i, 1)
            $urlsValues = $urlsValues
          }}
        >
          Remove
        </button>
      </div>
    {/each}

    <button
      type="button"
      onclick={() => {
        $urlsValues = [...$urlsValues, '']
      }}
    >
      Add URL
    </button>
  </div>

  <div class="input-group">
    <div>
      <button type="submit" disabled={$submitting}>
        {$form.id ? 'Update Source' : 'Create Source'}
      </button>

      {#if !$form.id}
        <button
          type="submit"
          formaction="?/generate"
          disabled={$submitting}
        >
          Generate from the 1st URL
        </button>
      {/if}
    </div>

    <a href="/admin/sources">Cancel</a>

    {#if $form.id}
      <button
        type="submit"
        formaction="?/delete"
        disabled={$submitting}
        onclick={() => confirm('Are you sure you want to delete this source?')}
      >
        Delete
      </button>
    {/if}
  </div>
  {#if $form.id && !business}
    <div class="input-group">
      <button
        type="submit"
        formaction="?/makeBusiness"
        disabled={$submitting || !!$tainted}
      >
        Generate business
      </button>
      {#if !!$tainted}
        <p>Save the changes before generating business</p>
      {/if}
    </div>
  {/if}
</form>

<ToggleSuperDebug data={$form} />
