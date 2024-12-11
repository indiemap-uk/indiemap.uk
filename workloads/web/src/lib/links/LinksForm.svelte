<script lang="ts">
	import type {BusinessIdType} from '@i/core/business'

	import {browser} from '$app/environment'
	import {type LinkCRUDListType, type LinkIdType, LinkSchema, type LinkType} from '@i/core/link'
	import IconArrowBackUp from '@tabler/icons-svelte/icons/arrow-back-up'
	import IconX from '@tabler/icons-svelte/icons/x'
	import SuperDebug from 'sveltekit-superforms'
	import {superForm, type SuperValidated} from 'sveltekit-superforms/client'
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
</script>

{#if $message}
	<div class="notification is-success">
		{$message}
	</div>
{/if}

<form method="POST" use:enhance>
	<input type="hidden" bind:value={$form.businessId} name="businessId" />

	{#if !$form.links.length}
		<p class="block">No links yet</p>
	{/if}

	{#each $form.links as _, i}
		<div class="field is-grouped">
			<input name="id" type="hidden" value={$form.links[i].id} />
			<input name="businessId" type="hidden" value={$form.links[i].businessId} />

			<div class="control is-expanded">
				<input
					name="label"
					class="input"
					type="text"
					placeholder="Label"
					bind:value={$form.links[i].label}
					{...$constraints.links?.label}
				/>
				{#if $errors.links?.[i]?.label}
					<span class="help is-danger">{$errors.links?.[i]?.label}</span>
				{/if}
			</div>
			<div class="control is-expanded">
				<input
					name="url"
					class="input"
					type="text"
					placeholder="URL"
					bind:value={$form.links[i].url}
					{...$constraints.links?.url}
				/>
				{#if $errors.links?.[i]?.url}
					<span class="help is-danger">{$errors.links?.[i]?.url}</span>
				{/if}
			</div>
			<div class="control">
				<button class="button is-rounded is-text" type="button" onclick={() => deleteLink(i, $form.links[i].id)}>
					<span class="icon">
						<IconX />
					</span>
				</button>
			</div>
		</div>
	{/each}

	<div class="block">
		<button class="button is-secondary" type="button" onclick={addLink}>New link</button>
	</div>

	{#if $form.deletedLinks.length}
		<p>To be deleted:</p>
	{/if}

	{#each $form.deletedLinks as _, i}
		<div class="field is-grouped">
			<input name="id" type="hidden" value={$form.deletedLinks[i].id} />
			<input name="businessId" type="hidden" value={$form.deletedLinks[i].businessId} />

			<div class="control is-expanded">
				<input
					name="label"
					class="input is-static"
					readonly
					type="text"
					placeholder="(no label)"
					value={$form.deletedLinks[i].label}
				/>
			</div>
			<div class="control is-expanded">
				<input name="url" class="input is-static" readonly type="text" value={$form.deletedLinks[i].url} />
			</div>
			<div class="control">
				<button
					class="button is-text"
					type="button"
					onclick={() => restoreLink($form.deletedLinks[i].id)}
					title="Restore this link"
				>
					<span class="icon">
						<IconArrowBackUp />
					</span>
				</button>
			</div>
		</div>
	{/each}

	<div class="buttons">
		<button class="button is-primary" disabled={!isTainted($tainted)} type="submit" formaction="?/links"
			>Save links</button
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
