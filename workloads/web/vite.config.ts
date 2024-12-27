import {sveltekit} from '@sveltejs/kit/vite'
import {visualizer} from 'rollup-plugin-visualizer'
import {defineConfig, type PluginOption} from 'vite'

export default defineConfig(() => {
	const plugins: PluginOption[] = [sveltekit()]

	if (process.env.BUNDLE_STATS === 'yes') {
		plugins.push(
			visualizer({
				emitFile: true,
				filename: 'stats.html',
			}),
		)
	}

	return {plugins}
})
