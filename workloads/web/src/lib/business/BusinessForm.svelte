<script lang="ts">
	import dayjs from 'dayjs'
	import type {BusinessCRUDType} from '@i/core/business'
	import type {TownSearchResultType} from '@i/core/town'
	import type {SuperValidated} from 'sveltekit-superforms'

	import {browser} from '$app/environment'
	import IconPencil from '@tabler/icons-svelte/icons/pencil'
	import Svelecte from 'svelecte'
	import SuperDebug, {superForm} from 'sveltekit-superforms'

	const {
		sForm,
		town,
	}: {
		/** sForm is the superform instance */
		sForm: SuperValidated<BusinessCRUDType>
		/** town is the currently selected town (if any) */
		town?: TownSearchResultType | null
	} = $props()
	const {constraints, enhance, errors, form, isTainted, message, tainted} = superForm(sForm, {invalidateAll: 'force'})

	const townOptionRenderer = (i: object, selectionSection?: boolean, inputValue?: string) => {
		if (!(i as TownSearchResultType).name) return 'Type to search...'
		return `${(i as TownSearchResultType).name}, ${(i as TownSearchResultType).county}`
	}

	const defaultOptions: TownSearchResultType[] = town ? [town] : []

	let editTown = $state($form.townId === 0)
	const toggleTownEdit = (e: Event) => {
		e.preventDefault()
		editTown = !editTown
	}
</script>

{#if Object.keys($errors).length}
	<div>
		<p>There was an error saving the business:</p>
		<ol>
			{#each Object.entries($errors) as err}
				<li>{err[0]}: {err[1]}</li>
			{/each}
		</ol>
	</div>
{/if}

{#if $message}
	<div class="notification is-success">
		{$message}
	</div>
{/if}

<form method="POST" use:enhance>
	{#if $form.id}
		<p class="field">
			<small>Created {dayjs($form.createdAt).format('MMMM D, YYYY h:mm A')}</small>
			{#if $form.createdAt.toString() !== $form.updatedAt.toString()}
				//
				<small>Updated {dayjs($form.updatedAt).format('MMMM D, YYYY h:mm A')}</small>
			{/if}
		</p>

		<input type="hidden" bind:value={$form.id} name="id" />
		<input type="hidden" bind:value={$form.createdAt} name="createdAt" />
		<input type="hidden" bind:value={$form.updatedAt} name="updatedAt" />
	{/if}

	<div class="field">
		<label class="label" for="name">Name</label>
		<div class="control">
			<input
				bind:value={$form.name}
				name="name"
				class="input"
				type="text"
				placeholder="Pin & Needle"
				{...$constraints.name}
				tabindex="0"
			/>
		</div>
		{#if $errors.name}
			<p class="help is-danger">{$errors.name}</p>
		{/if}
	</div>
	<div class="field">
		<label class="label" for="description">Description</label>
		<div class="control">
			<textarea
				bind:value={$form.description}
				name="description"
				class="textarea"
				placeholder="Making Pins & Needles since 1899 (optional)"
				{...$constraints.description}
			></textarea>
		</div>
	</div>

	<label class="label" for="townId">Town</label>
	<div class="field is-grouped">
		<Svelecte
			renderer={townOptionRenderer}
			minQuery={3}
			name="townId"
			bind:value={$form.townId}
			fetch="/api/town/search?q=[query]"
			valueField="id"
			labelField="name"
			options={defaultOptions}
		/>
		<button class="button" type="button" onclick={() => ($form.townId = null)}>Clear</button>
	</div>

	<div class="level">
		<div class="level-left">
			<div class="level-item">
				<button
					class="button is-primary"
					type="submit"
					disabled={!isTainted($tainted)}
					formaction={$form.id ? `?/update` : `?/create`}>Save</button
				>
			</div>
		</div>
		<div class="level-right">
			<div class="level-item">
				{#if $form.id}
					<button
						formaction="?/delete"
						name="delete"
						class="button is-danger"
						type="submit"
						onclick={(e) => !confirm('Are you sure?') && e.preventDefault()}>Delete</button
					>
				{/if}
			</div>
		</div>
	</div>
</form>

{#if browser && window.localStorage.getItem('superdebug')}
	<div class="mt-5">
		<SuperDebug data={$form} />
	</div>
{/if}

<style>
	:global(:root) {
		--sv-color: hsl(221, 14%, 21%);
		--sv-min-height: var(--bulma-control-height);
		--sv-bg: #fff;
		--sv-disabled-bg: var(--bulma-background);
		--sv-border: var(--bulma-control-border-width) solid rgb(214, 217, 224);
		--sv-border-radius: 6px;
		--sv-general-padding: 4px;
		--sv-control-bg: var(--sv-bg);
		--sv-item-wrap-padding: 3px 3px 3px 6px;
		--sv-item-selected-bg: #efefef;
		--sv-item-btn-color: #000;
		--sv-item-btn-color-hover: #777;
		--sv-item-btn-bg: #efefef;
		--sv-item-btn-bg-hover: #ddd;
		--sv-icon-color: transparent;
		--sv-icon-color-hover: transparent;
		--sv-icon-bg: transparent;
		--sv-icon-size: 0px;
		--sv-separator-bg: #ccc;
		--sv-btn-border: 0;
		--sv-placeholder-color: #ccccd6;
		--sv-dropdown-bg: var(--sv-bg);
		--sv-dropdown-offset: 1px;
		--sv-dropdown-border: 1px solid rgba(0, 0, 0, 0.15);
		--sv-dropdown-width: auto;
		--sv-dropdown-shadow: 0 6px 12px #0000002d;
		--sv-dropdown-height: 320px;
		--sv-dropdown-active-bg: #f2f5f8;
		--sv-dropdown-selected-bg: #ecf3f9;
		--sv-create-kbd-border: 1px solid #efefef;
		--sv-create-kbd-bg: #fff;
		--sv-create-disabled-bg: #fcbaba;
		--sv-loader-border: 2px solid #ccc;
	}
</style>
