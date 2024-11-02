<script lang="ts">
	import {debounce} from '$lib/debounce.js'
	import type {BusinessCRUDType} from '@i/core/business'
	import type {TownSearchResultType} from '@i/core/town'
	import type {Writable} from 'svelte/store'
	import {superForm} from 'sveltekit-superforms'
	import type {SuperValidated} from 'sveltekit-superforms'

	const {
		sForm,
		isLoading,
		isError,
		isSuccess,
		towns = [],
		townSearchFilter,
	}: {
		sForm: SuperValidated<BusinessCRUDType>
		isError: boolean
		isLoading: boolean
		isSuccess: boolean
		towns: TownSearchResultType[]
		townSearchFilter: Writable<string>
	} = $props()
	const {constraints, enhance, errors, form, message} = superForm(sForm)

	// Select the first town by default
	$effect(() => {
		if (!towns?.map((t) => t.id).includes($form.townId) && isSuccess) {
			$form.townId = towns?.[0].id
		}
	})

	$inspect({message, errors})
</script>

{#if $message}
	<h2>{$message}</h2>
{/if}

<div class="block">
	<form method="POST" use:enhance>
		{#if $form.id}
			<input type="hidden" bind:value={$form.id} name="id" />
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
		<div class="field">
			<label class="label" for="townSearch">Town</label>
			<div class="control" class:is-loading={isLoading} class:is-danger={isError}>
				<input use:debounce={{callback: (f) => ($townSearchFilter = f)}} name="townSearch" class="input" type="text" />
			</div>
		</div>

		<div class="field">
			<ul class="grid is-col-min-15">
				{#if isSuccess}
					{#each towns as town}
						<li>
							<label for={String(town.id)} class="radio">
								<input bind:group={$form.townId} type="radio" name="townId" id={String(town.id)} value={town.id} />
								{town.name} ({town.county})
							</label>
						</li>
					{/each}
				{:else}
					<input type="hidden" bind:value={$form.townId} name="townId" />
				{/if}
			</ul>
		</div>

		<button class="button is-primary" type="submit">Save</button>
		{#if $form.id}
			<button
				name="delete"
				class="button is-danger"
				type="submit"
				onclick={(e) => !confirm('Are you sure?') && e.preventDefault()}>Delete</button
			>
		{/if}
	</form>
</div>
