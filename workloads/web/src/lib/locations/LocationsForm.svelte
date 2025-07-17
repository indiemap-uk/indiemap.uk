<script lang="ts">
import type {BusinessIdType} from '@i/core/business'

import ToggleSuperDebug from '$lib/components/ToggleSuperDebug.svelte'
import {
  type LocationCRUDListType,
  type LocationIdType,
  type LocationType,
  type LocationUserCreateType,
  LocationSchema,
} from '@i/core/location'
import IconArrowBackUp from '@tabler/icons-svelte/icons/arrow-back-up'
import IconX from '@tabler/icons-svelte/icons/x'
import {type SuperValidated, superForm} from 'sveltekit-superforms/client'
import * as v from 'valibot'

const {
  businessId,
  sForm,
}: {
  businessId: BusinessIdType
  /** sForm is the superform instance */
  sForm: SuperValidated<LocationCRUDListType>
} = $props()

const {constraints, enhance, errors, form, isTainted, message, reset, tainted} = superForm(sForm, {
  dataType: 'json',
  invalidateAll: 'force',
  resetForm: false,
})

const addLocation = () => {
  $form.locations = $form.locations.concat(
    {
      address: '',
      businessId,
      label: '',
    } satisfies LocationUserCreateType,
  )
}

const deleteLocation = (index: number, id?: LocationIdType) => {
  if (!id) {
    const location = $form.locations[index]
    const isEmpty = !location.label && !location.address
    if (!isEmpty && !confirm('Unsaved location, there is no undo. Are you sure?')) {
      return
    }

    $form.locations = $form.locations.filter((_, i) => i !== index)
    return
  }

  const location = $form.locations.find((location) => location.id === id)
  $form.locations = $form.locations.filter((location) => location.id !== id)

  if (v.is(LocationSchema, location)) {
    $form.deletedLocations = $form.deletedLocations.concat(location)
  }
}

const restoreLocation = (id: LocationIdType) => {
  const location = $form.deletedLocations.find((location) => location.id === id)
  $form.deletedLocations = $form.deletedLocations.filter((location) => location.id !== id)

  if (v.is(LocationSchema, location)) {
    $form.locations = $form.locations.concat(location)
  }
}
</script>

{#if $message}
  <div>
    {$message}
  </div>
{/if}

<form method="POST" use:enhance class="admin">
  <input type="hidden" bind:value={$form.businessId} name="businessId" />

  {#if !$form.locations.length}
    <p>No locations yet</p>
  {/if}

  {#each $form.locations as _, i}
    <div class="flow">
      <input name="id" type="hidden" value={$form.locations[i].id} />
      <input name="businessId" type="hidden" value={$form.locations[i].businessId} />

      <div>
        {#if i === 0}<label for="label">Label</label>{/if}
        <input
          name="label"
          type="text"
          placeholder="Label"
          bind:value={$form.locations[i].label}
          {...$constraints.locations?.label}
        />
        {#if $errors.locations?.[i]?.label}
          <span>{$errors.locations?.[i]?.label}</span>
        {/if}
      </div>
      <div>
        {#if i === 0}<label for="address">Address</label>{/if}
        <input
          name="address"
          type="text"
          placeholder="Address"
          bind:value={$form.locations[i].address}
          {...$constraints.locations?.address}
        />
        {#if $errors.locations?.[i]?.address}
          <span>{$errors.locations?.[i]?.address}</span>
        {/if}
      </div>
      <div>
        {#if i === 0}<label for="latitude">Latitude</label>{/if}
        <input
          name="latitude"
          disabled
          type="text"
          placeholder="(automatic)"
          bind:value={$form.locations[i].latitude}
          {...$constraints.locations?.latitude}
        />
      </div>
      <div>
        {#if i === 0}<label for="longitude">Longitude</label>{/if}
        <input
          name="longitude"
          type="text"
          disabled
          placeholder="(automatic)"
          bind:value={$form.locations[i].longitude}
          {...$constraints.locations?.longitude}
        />
      </div>
      <div>
        {#if i === 0}<label for="" style="opacity:0">Map</label>{/if}
        {#if $form.locations[i].latitude}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${$form.locations[i].latitude},${
              $form.locations[i].longitude
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >Map</a>
        {:else}
          <button disabled>Map</button>
        {/if}
      </div>
      <div>
        {#if i === 0}<label for="actions" style="opacity:0">Delete</label>{/if}
        <button
          type="button"
          onclick={() => deleteLocation(i, $form.locations[i].id)}
        >
          <span>
            <IconX />
          </span>
        </button>
      </div>
    </div>
  {/each}

  <div>
    <button type="button" onclick={addLocation}>New location</button>
  </div>

  {#if $form.deletedLocations.length}
    <p>To be deleted:</p>
  {/if}

  {#each $form.deletedLocations as _, i}
    <div>
      <input name="id" type="hidden" value={$form.deletedLocations[i].id} />
      <input name="businessId" type="hidden" value={$form.deletedLocations[i].businessId} />

      <div>
        <input
          name="label"
          readonly
          type="text"
          placeholder="(no label)"
          value={$form.deletedLocations[i].label}
        />
      </div>
      <div>
        <input name="address" readonly type="text" value={$form.deletedLocations[i].address} />
      </div>
      <div>
        <button
          type="button"
          onclick={() => restoreLocation($form.deletedLocations[i].id)}
          title="Restore this location"
        >
          <span>
            <IconArrowBackUp />
          </span>
        </button>
      </div>
    </div>
  {/each}

  <div>
    <button disabled={!isTainted($tainted)} type="submit" formaction="?/locations">
      Save locations
    </button>
    {#if isTainted($tainted)}
      <button type="button" onclick={() => confirm('Sure?') && reset()}>Reset</button>
    {/if}
  </div>
</form>

<ToggleSuperDebug data={$form} />
