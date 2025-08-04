<script lang="ts">
import ToggleSuperDebug from '$lib/components/ToggleSuperDebug.svelte'
import {IconClipboard, IconExternalLink} from '@tabler/icons-svelte'
import {arrayProxy, superForm} from 'sveltekit-superforms'

const {sForm, business, notes = []} = $props()

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

<form method="POST" action="?/{$form.id ? 'update' : 'create'}" use:enhance class="admin">
  {#if $form.id}
    <input type="hidden" name="id" value={$form.id} />
  {/if}

  {#if business}
    Business: <a href={`/admin/business/${business.id}`}>
      {business.name}
    </a>
  {/if}

  {#if notes.length > 0}
    <div>
      <p><strong>Notes</strong></p>
      <ul>
        {#each notes as note}
          <li>{note.content}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <div>
    <label for="name">Name</label>
    <input
      type="text"
      name="name"
      bind:value={$form.name}
      placeholder="Enter source name"
    />
  </div>

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
        <button
          title="Open URL"
          onclick={(e) => {
            e.preventDefault()
            if ($urlsValues[i]) {
              window.open($urlsValues[i] as string, '_blank', 'noopener,noreferrer')
            }
          }}
          disabled={!$urlsValues[i]}
        >
          <IconExternalLink />
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
          formaction="?/makeFromUrl"
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
