const limit = 100

export const load = async ({locals, url}) => {
  const offset = parseInt(url.searchParams.get('offset') || '0')

  const towns = await locals.container.townRepository.townsWithBusiness({
    limit,
    offset,
    order: {
      by: 'name',
      direction: 'ASC',
    },
  })

  return {
    towns,
    limit,
    nextOffset: offset + limit,
    previousOffset: Math.max(0, offset - limit),
    hasPrevious: offset > 0,
  }
}
