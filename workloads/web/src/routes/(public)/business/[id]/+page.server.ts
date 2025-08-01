import {error} from '@sveltejs/kit'
import * as v from 'valibot'

export const load = async ({locals, params}) => {
  const businessId = v.safeParse(v.string(), params.id)
  if (!businessId.success) {
    throw error(404, 'Not found')
  }

  const business = await locals.container.businessService.getById(businessId.output, 'live')
  if (!business) {
    throw error(404, 'Not found')
  }

  return {
    business,
  }
}
