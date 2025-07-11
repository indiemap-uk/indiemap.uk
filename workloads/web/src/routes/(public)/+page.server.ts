const limit = 10

export const load = async ({locals}) => {
  const latestBusinesses = locals.container.businessRepository.search({status: 'live'}, {
    limit,
    order: {
      by: 'createdAt',
      direction: 'DESC',
    },
  })

  const townsWithBusiness = locals.container.townRepository.townsWithBusiness({
    limit,
    offset: 0,
    order: {
      by: 'businessCount',
      direction: 'DESC',
    },
  })

  return {
    latestBusinesses,
    townsWithBusiness,
  }
}
