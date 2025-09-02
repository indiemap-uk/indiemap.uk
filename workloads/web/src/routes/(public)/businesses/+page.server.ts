const limit = 100

export const load = async ({locals, url, setHeaders}) => {
  const offset = parseInt(url.searchParams.get('offset') || '0')

  const cachedBusinesses = await locals.container.cache.memo(
    `businesses-${offset}`,
    () =>
      locals.container.businessRepository.search({status: 'live'}, {
        limit,
        offset,
        order: {
          by: 'name',
          direction: 'ASC',
        },
      }),
  )

  setHeaders({
    'x-cached-businesses': cachedBusinesses.isCached ? 'true' : 'false',
  })

  return {
    businesses: cachedBusinesses.value,
    limit,
    nextOffset: offset + limit,
    previousOffset: Math.max(0, offset - limit),
    hasPrevious: offset > 0,
  }
}
