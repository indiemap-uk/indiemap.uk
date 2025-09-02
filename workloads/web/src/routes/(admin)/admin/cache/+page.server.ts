import {setFlash} from 'sveltekit-flash-message/server'
import type {Actions} from './$types'

export const actions = {
  clear: async ({locals, cookies}) => {
    await locals.container.cache.clear()

    setFlash({message: 'Cache cleared', type: 'success'}, cookies)
    return {success: true}
  },
} satisfies Actions
