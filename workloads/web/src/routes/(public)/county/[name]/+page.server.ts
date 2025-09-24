import {countyTownIds} from '@i/core/town'
import {error} from '@sveltejs/kit'
import * as v from 'valibot'

export const load = async ({locals, params, setHeaders}) => {
  const countyName = v.safeParse(v.string(), params.name)
  if (!countyName.success) {
    throw error(404, 'Not found')
  }

  const county = decodeURIComponent(countyName.output)
  const townIds = countyTownIds.get(county)

  if (!townIds) {
    throw error(404, 'Not found')
  }

  const businesses = await locals.container.cache.memo(`business-in-county-${countyName.output}`, async () => {
    const business = await locals.container.businessService.search({townIds, county, status: 'live'}, {limit: 100})

    if (!business) {
      throw error(404, 'Not found')
    }

    return business
  })

  setHeaders({
    'x-cached-businesses': businesses.isCached ? 'true' : 'false',
  })

  return {
    county,
    businesses: businesses.value,
  }
}
