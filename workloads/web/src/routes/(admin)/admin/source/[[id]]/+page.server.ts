import {SourceCreateSchema, SourceSchema} from '@i/core/source'
import {fail, redirect} from '@sveltejs/kit'
import {message, superValidate} from 'sveltekit-superforms'
import {valibot} from 'sveltekit-superforms/adapters'
import * as v from 'valibot'

import type {Actions, PageServerLoad} from './$types'

export const load: PageServerLoad = async ({parent}) => {
  const {source} = await parent()

  // No ID = new source form
  if (!source) {
    const sourceForm = await superValidate(valibot(SourceCreateSchema))

    return {sourceForm}
  }

  const sourceForm = await superValidate(source, valibot(SourceSchema))

  return {source, sourceForm}
}

export const actions = {
  create: async ({locals, request}) => {
    const form = await superValidate(request, valibot(SourceCreateSchema))

    if (!form.valid) {
      return fail(400, {form})
    }

    // Create new source
    let source
    try {
      source = await locals.container.sourceService.create(form.data)
    } catch (error) {
      console.error(error)
      return fail(500, {form})
    }

    return redirect(301, `/admin/source/${source.id.toString()}`)
  },

  delete: async ({locals, request}) => {
    const formData = await request.formData()

    await locals.container.sourceService.delete(v.parse(v.string(), formData.get('id')))

    return redirect(301, '/admin/sources')
  },

  update: async ({locals, request}) => {
    const form = await superValidate(request, valibot(SourceSchema))

    if (!form.valid) {
      console.error(form.errors)
      return fail(400, {form})
    }

    try {
      await locals.container.sourceService.update(v.parse(SourceSchema, form.data))

      return message(form, 'Source updated')
    } catch (error) {
      console.error(error)
      return fail(500, {form})
    }
  },
} satisfies Actions
