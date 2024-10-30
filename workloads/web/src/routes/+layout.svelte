<script lang="ts">
	import 'bulma/css/bulma.css'

	import {QueryClientProvider, QueryClient} from '@tanstack/svelte-query'
	import {SvelteQueryDevtools} from '@tanstack/svelte-query-devtools'
	import {browser} from '$app/environment'

	const queryClient = new QueryClient()
</script>

<QueryClientProvider client={queryClient}>
	<slot />
	{#if browser && document.location.href.includes('localhost')}
		<SvelteQueryDevtools />
	{/if}
</QueryClientProvider>

<style>
	:global(body) {
		overflow: hidden;
	}
</style>
