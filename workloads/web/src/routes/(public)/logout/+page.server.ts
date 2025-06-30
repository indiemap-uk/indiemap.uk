import {signOut} from '$lib/authN/authjs'
import {redirect} from '@sveltejs/kit'

import type {Actions} from './$types'

export const actions: Actions = {
  default: async (event) => {
    const session = await event.locals.auth()
    if (!session) {
      redirect(303, '/')
    }

    await signOut(event)
  },
}
