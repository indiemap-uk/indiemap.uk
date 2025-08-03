import {error} from '@sveltejs/kit'
import * as v from 'valibot'

import type {LayoutServerLoad} from './$types'

export const load: LayoutServerLoad = async ({locals, params}) => {
  if (!params?.id) {
    return {
      source: null,
      notes: [],
    }
  }

  // ID provided = edit source form
  const {sourceService, noteService} = locals.container
  const source = await sourceService.getById(v.parse(v.string(), params.id))
  if (!source) {
    throw error(404, 'Source not found')
  }

  // Fetch notes for this source
  const notes = await noteService.getByEntityId('source', source.id)

  return {
    source,
    notes,
  }
}
