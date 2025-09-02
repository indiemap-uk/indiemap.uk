const limit = 100

export const load = async ({locals, url, setHeaders}) => {
  const offset = parseInt(url.searchParams.get('offset') || '0')

  const cachedTowns = await locals.container.cache.memo(
    `towns-${offset}`,
    () =>
      locals.container.townRepository.townsWithBusiness({
        limit,
        offset,
        order: {
          by: 'name',
          direction: 'ASC',
        },
      }),
  )

  setHeaders({
    'x-cached-towns': cachedTowns.isCached ? 'true' : 'false',
  })

  return {
    towns: cachedTowns.value,
    limit,
    nextOffset: offset + limit,
    previousOffset: Math.max(0, offset - limit),
    hasPrevious: offset > 0,
  }
}
