<script lang="ts">
	const {image, name}: {image?: string; name?: string | null} = $props()
</script>

{#if image}
	<div class="level-item">
		<figure class="image is-32x32">
			<img class="is-rounded" alt="Logged in user avatar" src={image} />
		</figure>
	</div>
{/if}
<div class="level-item">
	<span class="is-size-6">{name}</span>
</div>
<div class="level-item">
	<form method="POST" action="/logout">
		<button class="button is-small" type="submit">
			<span>Sign out</span>
		</button>
	</form>
</div>
