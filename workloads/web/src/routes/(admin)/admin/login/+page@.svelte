<script lang="ts">
	import {signIn} from '@auth/sveltekit/client'

	const {data} = $props()
</script>

<div class="container is-fluid has-text-centered">
	<div class="section is-medium">
		<a class="button mx-auto" href="/auth/signin">Admin Sign In</a>
	</div>
</div>
