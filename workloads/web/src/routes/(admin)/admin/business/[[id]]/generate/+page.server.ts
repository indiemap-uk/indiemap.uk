import {fail, redirect} from '@sveltejs/kit'
import {setFlash} from 'sveltekit-flash-message/server'
import {valibot} from 'sveltekit-superforms/adapters'
import {superValidate} from 'sveltekit-superforms/server'
import * as v from 'valibot'

import type {Actions} from './$types'

const SeedSchema = v.object({
  urls: v.string(),
})

export const load = async () => {
  const form = await superValidate(valibot(SeedSchema))

  return {form}
}

export const actions = {
  default: async ({locals, request, cookies}) => {
    const form = await superValidate(request, valibot(SeedSchema))

    if (!form.valid) {
      console.error('error in form', form.errors)
      return fail(400, {form})
    }
    const urls = form.data.urls.split('\n')

    const source = await locals.container.sourceRepository.create({urls})

    await locals.container.workerService.addJob('makeBusinessFromSource', source)

    setFlash({message: 'Business generation started! Check back in a few minutes.', type: 'success'}, cookies)

    redirect(303, `/admin/businesses`)
  },
} satisfies Actions
