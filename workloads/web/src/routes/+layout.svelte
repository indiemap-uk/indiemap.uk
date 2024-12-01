<script lang="ts">
	/** THIS IS THE TOP LEVEL LAYOUT */

	import './css/reset.css'
	import './css/open-props.min.css'
	import './css/theme.css'
	import './css/global.css'
	import './css/composition.css'
	import './css/utility.css'
	import './css/blocks/block.css'
	import './css/form.css'
	import './css/exceptions.css'

	const {children} = $props()
</script>

{@render children()}

<style>
</style>
