<script lang="ts">
	const {image, name}: {image?: string; name?: string | null} = $props()
</script>

<div class="level gap-3">
	{#if image}
		<div>
			<img alt="Logged in user avatar" src={image} class="avatar" />
		</div>
	{/if}
	<div>
		<span class="color-0 text-s">{name}</span>
	</div>
	<div>
		<form method="POST" action="/logout">
			<button type="submit" class="button" data-button-variant="secondary" data-button-size="small">
				<span>Sign out</span>
			</button>
		</form>
	</div>
</div>
