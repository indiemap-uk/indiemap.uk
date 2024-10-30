/**
 * Debounce the input value change event
 *
 * Copied from https://github.com/svelte-seoul/svelte-debounce/blob/master/index.js and added types
 *
 * Example: run console.log after 750ms of the last input event, no matter how many input events are fired
 *
 * ```svelte
 *   <input use:debounce={{callback: console.log}} />
 * ```
 */
const debounce = (node: HTMLElement, config: {callback: (v: string) => void; delay?: number}) => {
	const {callback, delay = 750} = config

	let timer: number

	const handleChange = (e: Event) => {
		const target = e.target as HTMLInputElement
		const {value} = target

		clearTimeout(timer)
		timer = window.setTimeout(() => {
			callback(value)
		}, delay)
	}

	node.addEventListener('input', handleChange)

	return {
		destroy() {
			node.removeEventListener('input', handleChange)
		},
	}
}

export {debounce}
