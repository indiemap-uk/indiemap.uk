<script lang="ts">
	import type {Writable} from 'svelte/store'

	const {}: {
		filter: Writable<string>
	} = $props()

	const {townQuery: tq, townSearchFilter} = useTownSearch()
</script>

<div class="field">
	<label class="label" for="townSearch">Town Search</label>
	<div class="control" class:is-loading={$tq.isLoading} class:is-danger={$tq.isError}>
		<input use:debounce={{callback: (f) => ($townSearchFilter = f)}} name="townSearch" class="input" type="text" />
	</div>
	<p class="help">3+ characters</p>
</div>

<div class="field">
	{#if $tq.isSuccess}
		<ul class="grid is-col-min-15">
			{#each $tq.data as town}
				<li>
					<label for={String(town.id)} class="radio">
						<input bind:group={$form.townId} type="radio" name="townId" id={String(town.id)} value={town.id} />
						{town.name} ({town.county})
					</label>
				</li>
			{/each}
		</ul>
	{/if}
</div>
