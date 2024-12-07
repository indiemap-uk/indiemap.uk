<script module>
	import '$lib/css/index.css'
	import {defineMeta} from '@storybook/addon-svelte-csf'

	const {Story} = defineMeta({
		title: 'Buttons',
	})

	const variants = ['primary', 'secondary', 'tertiary']
	const sizes = ['small', 'normal', 'large']
</script>

<Story name="Buttons">
	{#snippet children()}
		<div class="grid">
			{#each sizes as size}
				{#each variants as variant}
					<button class="button" data-button-variant={variant} data-button-size={size}>
						<span>{size}</span>
					</button>
				{/each}
			{/each}
		</div>
	{/snippet}
</Story>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		justify-items: start;
		align-items: center;
		max-width: min-content;
	}
</style>
