import {BusinessCRUDSchema, BusinessSchema, BusinessUserCreateSchema} from '@i/core/business'
import {fail, redirect} from '@sveltejs/kit'
import {setFlash} from 'sveltekit-flash-message/server'
import {superValidate} from 'sveltekit-superforms'
import {valibot} from 'sveltekit-superforms/adapters'
import * as v from 'valibot'

import type {Actions, PageServerLoad} from './$types'

export const load: PageServerLoad = async ({parent, locals}) => {
  const {business} = await parent()

  // No ID = new business form
  if (!business) {
    const businessForm = await superValidate(valibot(BusinessCRUDSchema))

    return {businessForm}
  }

  const businessForm = await superValidate(business, valibot(BusinessCRUDSchema))
  const source = await locals.container.sourceService.getByBusinessId(business.id)

  return {business, businessForm, source}
}

export const actions = {
  create: async ({locals, request}) => {
    const form = await superValidate(request, valibot(BusinessUserCreateSchema))

    if (!form.valid) {
      return fail(400, {form})
    }

    // Create new business
    let business
    try {
      business = await locals.container.businessService.create(form.data)
    } catch (error) {
      console.error(error)
      return fail(500, {form})
    }

    redirect(301, `/admin/business/${business.id.toString()}`)
  },

  delete: async ({locals, request}) => {
    const formData = await request.formData()

    await locals.container.businessService.delete(v.parse(v.string(), formData.get('id')))

    redirect(301, '/admin/businesses')
  },

  update: async ({locals, request, cookies}) => {
    const form = await superValidate(request, valibot(BusinessCRUDSchema))

    if (!form.valid) {
      console.error(form.errors)
      return fail(400, {form})
    }

    try {
      await locals.container.businessService.update(v.parse(BusinessSchema, form.data))
    } catch (error) {
      console.error(error)
      return fail(500, {form})
    }

    setFlash({message: 'Business updated', type: 'success'}, cookies)
    redirect(301, '/admin/businesses')
  },
} satisfies Actions
