<script lang="ts">
	import {superForm} from 'sveltekit-superforms/client'

	const {data} = $props()
	const {form, enhance, submitting} = superForm(data.form)
</script>

<p>Generate a business from a list of URLs</p>
<br />

<form method="POST" use:enhance>
	<div class="field">
		<label class="label" for="urls">URLs</label>
		<div class="control">
			<textarea bind:value={$form.urls} name="urls" class="textarea" placeholder="Enter URLs (one per line)" rows="5"
			></textarea>
		</div>
	</div>

	<div class="field">
		<div class="control">
			<button class="button is-primary" type="submit" disabled={$submitting}>
				{#if $submitting}
					Generating...
				{:else}
					Generate Business
				{/if}
			</button>
		</div>
	</div>
</form>
