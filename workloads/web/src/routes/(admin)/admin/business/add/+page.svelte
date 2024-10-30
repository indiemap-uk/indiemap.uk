<script lang="ts">
	import {browser} from '$app/environment'
	import {useTownSearch} from '$lib/api/townQuery.js'
	import {debounce} from '$lib/debounce.js'
	import SuperDebug, {superForm} from 'sveltekit-superforms'

	const {data} = $props()
	const {constraints, enhance, errors, form, message} = superForm(data.form)
	const {townQuery, townSearchFilter} = useTownSearch()

	// Select the first town by default
	$effect(() => {
		if (!$form.townId && $townQuery.isSuccess) {
			console.log('setting townId', $townQuery.data?.[0].id)
			$form.townId = $townQuery.data?.[0].id
		}
	})
</script>

<h1 class="title">New a business</h1>

{#if $message}
	<div class="notification is-success">
		{$message}
	</div>
{/if}

<div class="block">
	<form action="?/add" method="post" use:enhance>
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
			<div class="control" class:is-loading={$townQuery.isLoading} class:is-danger={$townQuery.isError}>
				<input use:debounce={{callback: (f) => ($townSearchFilter = f)}} name="townSearch" class="input" type="text" />
			</div>
		</div>

		<div class="field">
			<ul>
				{#if $townQuery.isSuccess}
					{#each $townQuery.data as town, index}
						<li>
							<label for={String(town.id)} class="radio">
								<input bind:group={$form.townId} type="radio" name="townId" id={String(town.id)} value={town.id} />
								{town.name}
							</label>
						</li>
					{/each}
				{/if}
			</ul>
		</div>

		<button class="button is-primary" type="submit">Save</button>
	</form>
</div>

{#if browser && document.location.href.includes('localhost')}
	<div class="block">
		<SuperDebug data={$form} />
	</div>
{/if}
