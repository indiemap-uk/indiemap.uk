import {error} from '@sveltejs/kit'

export const load = async ({locals, params, setHeaders}) => {
  const townId = Number(params.id)

  if (!townId || isNaN(townId)) {
    throw error(404, 'Not found')
  }

  const [cachedTown, cachedBusinesses] = await Promise.all([
    locals.container.cache.memo(`town-${townId}`, async () => {
      const town = await locals.container.townService.getById(townId)
      if (!town) {
        throw error(404, 'Not found')
      }
      return town
    }),

    locals.container.cache.memo(
      `town-businesses-${townId}`,
      () => locals.container.businessService.search({townId, status: 'live'}, {limit: 100}),
    ),
  ])

  setHeaders({
    'x-cached-town': cachedTown.isCached ? 'true' : 'false',
    'x-cached-businesses': cachedBusinesses.isCached ? 'true' : 'false',
  })

  return {
    businesses: cachedBusinesses.value,
    town: cachedTown.value,
  }
}
