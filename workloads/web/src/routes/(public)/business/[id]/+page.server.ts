import {error} from '@sveltejs/kit'
import * as v from 'valibot'

export const load = async ({locals, params, setHeaders}) => {
  const businessId = v.safeParse(v.string(), params.id)
  if (!businessId.success) {
    throw error(404, 'Not found')
  }

  const cachedBusiness = await locals.container.cache.memo(`business-${businessId.output}`, async () => {
    const business = await locals.container.businessService.getById(businessId.output, 'live')
    if (!business) {
      throw error(404, 'Not found')
    }
    return business
  })

  setHeaders({
    'x-cached-business': cachedBusiness.isCached ? 'true' : 'false',
  })

  return {
    business: cachedBusiness.value,
  }
}
