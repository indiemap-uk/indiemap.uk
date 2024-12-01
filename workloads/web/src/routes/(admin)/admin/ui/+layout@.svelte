<script lang="ts">
	const {children} = $props()
</script>

<div class="sticky-2">
	<nav class="nav">
		<a href="/admin/ui/">Typography</a>
		<a href="/admin/ui/buttons">Buttons</a>
		<a href="/admin/ui/form">Form</a>
	</nav>

	<main class="cage">
		{@render children()}
	</main>
</div>

<style>
	nav {
		padding: 1rem;
		display: flex;
		justify-content: flex-start;
		gap: 1rem;
	}

	.cage {
		width: var(--op-size-md);
		margin: 5ch auto;
	}
</style>
