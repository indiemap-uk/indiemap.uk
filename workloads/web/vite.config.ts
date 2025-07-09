import {sveltekit} from '@sveltejs/kit/vite'
import {visualizer} from 'rollup-plugin-visualizer'
import {type PluginOption, defineConfig} from 'vite'

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

  return {
    plugins,
    server: {
      watch: {
        // Do NOT ignore the workspace packages
        ignored: ['!**/node_modules/@i/**'],
      },
    },
  }
})
