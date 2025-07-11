const limit = 100

export const load = async ({locals, url}) => {
  const offset = parseInt(url.searchParams.get('offset') || '0')

  const businesses = await locals.container.businessRepository.search({status: 'live'}, {
    limit,
    offset,
    order: {
      by: 'name',
      direction: 'ASC',
    },
  })

  return {
    businesses,
    limit,
    nextOffset: offset + limit,
    previousOffset: Math.max(0, offset - limit),
    hasPrevious: offset > 0,
  }
}
