<script lang="ts">
import type {BusinessIdType} from '@i/core/business'

import ToggleSuperDebug from '$lib/components/ToggleSuperDebug.svelte'
import {type LinkCRUDListType, type LinkIdType, type LinkType, LinkSchema} from '@i/core/link'
import IconArrowBackUp from '@tabler/icons-svelte/icons/arrow-back-up'
import IconArrowBarToDown from '@tabler/icons-svelte/icons/arrow-bar-to-down'
import IconArrowBarToUp from '@tabler/icons-svelte/icons/arrow-bar-to-up'
import IconArrowDown from '@tabler/icons-svelte/icons/arrow-down'
import IconArrowUp from '@tabler/icons-svelte/icons/arrow-up'
import IconExternalLink from '@tabler/icons-svelte/icons/external-link'
import IconX from '@tabler/icons-svelte/icons/x'
import {type SuperValidated, superForm} from 'sveltekit-superforms/client'
import * as v from 'valibot'

const {
  businessId,
  sForm,
}: {
  businessId: BusinessIdType
  /** sForm is the superform instance */
  sForm: SuperValidated<LinkCRUDListType>
} = $props()

const {constraints, enhance, errors, form, isTainted, message, reset, tainted} = superForm(sForm, {
  dataType: 'json',
  invalidateAll: 'force',
  resetForm: false,
})

const addLink = () => {
  $form.links = $form.links.concat({
    businessId,
    label: '',
    url: '',
    order: $form.links.length,
  })
}

const deleteLink = (index: number, id?: LinkIdType) => {
  if (!id) {
    const link = $form.links[index]
    const isEmpty = !link.label && !link.url
    if (!isEmpty && !confirm('Unsaved link, there is no undo. Are you sure?')) {
      return
    }

    $form.links = $form.links.filter((_, i) => i !== index)
    return
  }

  const link = $form.links.find((link) => link.id === id)
  $form.links = $form.links.filter((link) => link.id !== id)

  if (v.is(LinkSchema, link)) {
    $form.deletedLinks = $form.deletedLinks.concat(link as LinkType)
  }
}

const restoreLink = (id: LinkIdType) => {
  const link = $form.deletedLinks.find((link) => link.id === id)
  $form.deletedLinks = $form.deletedLinks.filter((link) => link.id !== id)

  if (v.is(LinkSchema, link)) {
    $form.links = $form.links.concat(link)
  }
}

const updateLinksOrder = (links: typeof $form.links) => {
  return links.map((link, i) => ({...link, order: i}))
}

const moveToTop = (index: number) => {
  const link = $form.links[index]
  const filteredLinks = $form.links.filter((_, i) => i !== index)
  const reorderedLinks = [link, ...filteredLinks]
  $form.links = updateLinksOrder(reorderedLinks)
}

const moveUp = (index: number) => {
  if (index === 0) return

  const links = [...$form.links]
  const currentLink = links[index]
  const previousLink = links[index - 1]

  links[index - 1] = currentLink
  links[index] = previousLink

  $form.links = updateLinksOrder(links)
}

const moveDown = (index: number) => {
  if (index === $form.links.length - 1) return

  const links = [...$form.links]
  const currentLink = links[index]
  const nextLink = links[index + 1]

  links[index] = nextLink
  links[index + 1] = currentLink

  $form.links = updateLinksOrder(links)
}

const moveToBottom = (index: number) => {
  const link = $form.links[index]
  const filteredLinks = $form.links.filter((_, i) => i !== index)
  const reorderedLinks = [...filteredLinks, link]
  $form.links = updateLinksOrder(reorderedLinks)
}
</script>

{#if $message}
  <div>
    {$message}
  </div>
{/if}

<form method="POST" use:enhance class="admin">
  <input type="hidden" bind:value={$form.businessId} name="businessId" />

  {#if !$form.links.length}
    <p>No links yet</p>
  {/if}

  {#each $form.links as _, i}
    <div>
      <input name="id" type="hidden" value={$form.links[i].id} />
      <input name="businessId" type="hidden" value={$form.links[i].businessId} />
      <input name="order" type="hidden" value={$form.links[i].order} />

      <div>
        <input
          name="label"
          type="text"
          placeholder="Label"
          bind:value={$form.links[i].label}
          {...$constraints.links?.label}
        />
        {#if $errors.links?.[i]?.label}
          <span>{$errors.links?.[i]?.label}</span>
        {/if}
      </div>
      <div>
        <input
          name="url"
          type="text"
          placeholder="URL"
          bind:value={$form.links[i].url}
          {...$constraints.links?.url}
        />
        {#if $errors.links?.[i]?.url}
          <span>{$errors.links?.[i]?.url}</span>
        {/if}
      </div>
      <div>
        {#if $form.links[i].url}
          <button
            type="button"
            onclick={() => window.open($form.links[i].url, '_blank')}
            title="Open link"
          >
            <span>
              <IconExternalLink />
            </span>
          </button>
        {/if}
        {#if i > 0}
          <button
            type="button"
            onclick={() => moveToTop(i)}
            title="Move to top"
          >
            <span>
              <IconArrowBarToUp />
            </span>
          </button>
          <button
            type="button"
            onclick={() => moveUp(i)}
            title="Move up"
          >
            <span>
              <IconArrowUp />
            </span>
          </button>
        {/if}
        {#if i < $form.links.length - 1}
          <button
            type="button"
            onclick={() => moveDown(i)}
            title="Move down"
          >
            <span>
              <IconArrowDown />
            </span>
          </button>
          <button
            type="button"
            onclick={() => moveToBottom(i)}
            title="Move to bottom"
          >
            <span>
              <IconArrowBarToDown />
            </span>
          </button>
        {/if}
        <button type="button" onclick={() => deleteLink(i, $form.links[i].id)}>
          <span>
            <IconX />
          </span>
        </button>
      </div>
    </div>
  {/each}

  <div>
    <button type="button" onclick={addLink}>New link</button>
  </div>

  {#if $form.deletedLinks.length}
    <p>To be deleted:</p>
  {/if}

  {#each $form.deletedLinks as _, i}
    <div>
      <input name="id" type="hidden" value={$form.deletedLinks[i].id} />
      <input name="businessId" type="hidden" value={$form.deletedLinks[i].businessId} />
      <input name="order" type="hidden" value={$form.deletedLinks[i].order} />

      <div>
        <input
          name="label"
          readonly
          type="text"
          placeholder="(no label)"
          value={$form.deletedLinks[i].label}
        />
      </div>
      <div>
        <input name="url" readonly type="text" value={$form.deletedLinks[i].url} />
      </div>
      <div>
        <button
          type="button"
          onclick={() => restoreLink($form.deletedLinks[i].id)}
          title="Restore this link"
        >
          <span>
            <IconArrowBackUp />
          </span>
        </button>
      </div>
    </div>
  {/each}

  <div>
    <button disabled={!isTainted($tainted)} type="submit" formaction="?/links">
      Save links
    </button>
    {#if isTainted($tainted)}
      <button type="button" onclick={() => confirm('Sure?') && reset()}>Reset</button>
    {/if}
  </div>
</form>

<ToggleSuperDebug data={$form} />
