import {SourceCreateSchema, SourceSchema} from '@i/core/source'
import {fail, redirect} from '@sveltejs/kit'
import {setFlash} from 'sveltekit-flash-message/server'
import {message, setError, superValidate} from 'sveltekit-superforms'
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

  generate: async ({locals, request, cookies}) => {
    const form = await superValidate(request, valibot(SourceCreateSchema))

    if (!form.valid) {
      return fail(400, {form})
    }

    if (form.data.urls.length !== 1) {
      return setError(form, 'Exactly 1 URL is required to generate a source')
    }

    await locals.container.workerService.addJob('makeSourceFromUrl', form.data.urls[0])

    setFlash({message: 'Source generation started! Check back in a few minutes.', type: 'success'}, cookies)
    return redirect(301, '/admin/sources')
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
      const parsed = v.parse(SourceSchema, form.data)
      await locals.container.sourceService.update(parsed)

      return message(form, 'Source updated')
    } catch (error) {
      console.error(error)
      return fail(500, {form})
    }
  },
} satisfies Actions
