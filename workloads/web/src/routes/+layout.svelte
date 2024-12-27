<script lang="ts">
	/** THIS IS THE TOP LEVEL LAYOUT */

	// The order here matters. Algolia 1st, then our custom CSS.
	import '@algolia/autocomplete-theme-classic'
	// index.css pulls in $lib/css/algolia.css too!
	import '$lib/css/index.css'

	const {children} = $props()
</script>

{@render children()}
