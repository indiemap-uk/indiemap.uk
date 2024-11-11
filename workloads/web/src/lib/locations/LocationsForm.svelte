<script lang="ts">
	import {browser} from '$app/environment'
	import type {BusinessIdType} from '@i/core/business'
	import {
		LocationSchema,
		type LocationCRUDListType,
		type LocationIdType,
		type LocationType,
		type LocationUserCreateType,
	} from '@i/core/location'
	import {IconArrowBackUp, IconX} from '@tabler/icons-svelte'
	import SuperDebug from 'sveltekit-superforms'
	import {superForm, type SuperValidated} from 'sveltekit-superforms/client'
	import * as v from 'valibot'

	const {
		businessId,
		sForm,
	}: {
		businessId: BusinessIdType
		/** sForm is the superform instance */
		sForm: SuperValidated<LocationCRUDListType>
	} = $props()

	const {form, enhance, constraints, message, tainted, isTainted, reset, errors} = superForm(sForm, {
		dataType: 'json',
		resetForm: false,
		invalidateAll: 'force',
	})

	const addLocation = () => {
		$form.locations = $form.locations.concat({
			address: '',
			businessId,
			label: '',
		} satisfies LocationUserCreateType)
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
			$form.locations = $form.locations.concat(location as LocationType)
		}
	}
</script>

{#if $message}
	<div class="notification is-success">
		{$message}
	</div>
{/if}

<form method="POST" use:enhance>
	<input type="hidden" bind:value={$form.businessId} name="businessId" />

	{#if !$form.locations.length}
		<p class="block">No locations yet</p>
	{/if}

	{#each $form.locations as _, i}
		<div class="field is-grouped">
			<input name="id" type="hidden" value={$form.locations[i].id} />
			<input name="businessId" type="hidden" value={$form.locations[i].businessId} />

			<div class="control">
				{#if i === 0}<label class="label" for="label">Label</label>{/if}
				<input
					name="label"
					class="input"
					type="text"
					placeholder="Label"
					bind:value={$form.locations[i].label}
					{...$constraints.locations?.label}
				/>
				{#if $errors.locations?.[i]?.label}
					<span class="help is-danger">{$errors.locations?.[i]?.label}</span>
				{/if}
			</div>
			<div class="control is-expanded">
				{#if i === 0}<label class="label" for="address">Address</label>{/if}
				<input
					name="address"
					class="input"
					type="text"
					placeholder="Address"
					bind:value={$form.locations[i].address}
					{...$constraints.locations?.address}
				/>
				{#if $errors.locations?.[i]?.address}
					<span class="help is-danger">{$errors.locations?.[i]?.address}</span>
				{/if}
			</div>
			<div class="control">
				{#if i === 0}<label class="label" for="latitude">Latitude</label>{/if}
				<input
					name="latitude"
					disabled
					type="text"
					class="input"
					placeholder="(automatic)"
					bind:value={$form.locations[i].latitude}
					{...$constraints.locations?.latitude}
				/>
			</div>
			<div class="control">
				{#if i === 0}<label class="label" for="longitude">Longitude</label>{/if}
				<input
					name="longitude"
					type="text"
					disabled
					class="input"
					placeholder="(automatic)"
					bind:value={$form.locations[i].longitude}
					{...$constraints.locations?.longitude}
				/>
			</div>
			<div class="control">
				{#if i === 0}<label class="label" for="" style="opacity:0">Map</label>{/if}
				{#if $form.locations[i].latitude}
					<a
						class="button is-ghost"
						href={`https://www.google.com/maps/search/?api=1&query=${$form.locations[i].latitude},${$form.locations[i].longitude}`}
						target="_blank"
						rel="noopener noreferrer">Map</a
					>
				{:else}
					<button class="button is-ghost" disabled>Map</button>
				{/if}
			</div>
			<div class="control">
				{#if i === 0}<label class="label" for="actions" style="opacity:0">Delete</label>{/if}
				<button
					class="button is-rounded is-text"
					type="button"
					onclick={() => deleteLocation(i, $form.locations[i].id)}
				>
					<span class="icon">
						<IconX />
					</span>
				</button>
			</div>
		</div>
	{/each}

	<div class="block">
		<button class="button is-secondary" type="button" onclick={addLocation}>New location</button>
	</div>

	{#if $form.deletedLocations.length}
		<p>To be deleted:</p>
	{/if}

	{#each $form.deletedLocations as _, i}
		<div class="field is-grouped">
			<input name="id" type="hidden" value={$form.deletedLocations[i].id} />
			<input name="businessId" type="hidden" value={$form.deletedLocations[i].businessId} />

			<div class="control is-expanded">
				<input
					name="label"
					class="input is-static"
					readonly
					type="text"
					placeholder="(no label)"
					value={$form.deletedLocations[i].label}
				/>
			</div>
			<div class="control is-expanded">
				<input name="address" class="input is-static" readonly type="text" value={$form.deletedLocations[i].address} />
			</div>
			<div class="control">
				<button
					class="button is-text"
					type="button"
					onclick={() => restoreLocation($form.deletedLocations[i].id)}
					title="Restore this location"
				>
					<span class="icon">
						<IconArrowBackUp />
					</span>
				</button>
			</div>
		</div>
	{/each}

	<div class="buttons">
		<button class="button is-primary" disabled={!isTainted($tainted)} type="submit" formaction="?/locations"
			>Save locations</button
		>
		{#if isTainted($tainted)}
			<button class="text" type="button" onclick={() => confirm('Sure?') && reset()}>Reset</button>
		{/if}
	</div>
</form>

{#if browser && window.localStorage.getItem('superdebug')}
	<div class="mt-5">
		<SuperDebug data={$form} />
	</div>
{/if}
