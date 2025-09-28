const limit = 10

export const load = async ({locals, setHeaders}) => {
  const {businessRepository, townRepository, cache} = locals.container

  const [latestBusinesses, townsWithBusiness, countiesWithBusiness] = await Promise.all([
    cache.memo('latestBusinesses', () =>
      businessRepository.search({status: 'live'}, {
        limit,
        order: {
          by: 'createdAt',
          direction: 'DESC',
        },
      })),

    cache.memo('townWithBusiness', () =>
      townRepository.townsWithBusiness({
        limit,
        offset: 0,
        order: {
          by: 'businessCount',
          direction: 'DESC',
        },
      })),

    cache.memo('countiesWithBusiness', () => townRepository.countiesWithBusiness()),
  ])

  setHeaders({
    'x-cached-latestBusinesses': latestBusinesses.isCached ? 'true' : 'false',
    'x-cached-townsWithBusiness': townsWithBusiness.isCached ? 'true' : 'false',
    'x-cached-countiesWithBusiness': countiesWithBusiness.isCached ? 'true' : 'false',
  })

  return {
    latestBusinesses: latestBusinesses.value,
    townsWithBusiness: townsWithBusiness.value,
    countiesWithBusiness: countiesWithBusiness.value,
  }
}
