<script lang="ts">
	import 'bulma/css/bulma.css'
	import {browser} from '$app/environment'
	import {QueryClient, QueryClientProvider} from '@tanstack/svelte-query'
	import {SvelteQueryDevtools} from '@tanstack/svelte-query-devtools'

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
