import {error} from '@sveltejs/kit'
import * as v from 'valibot'

import type {LayoutServerLoad} from './$types'

export const load: LayoutServerLoad = async ({locals, params}) => {
  if (!params?.id) {
    return {
      source: null,
    }
  }

  // ID provided = edit source form
  const {sourceService} = locals.container
  const source = await sourceService.getById(v.parse(v.string(), params.id))
  if (!source) {
    throw error(404, 'Source not found')
  }

  return {
    source,
  }
}
