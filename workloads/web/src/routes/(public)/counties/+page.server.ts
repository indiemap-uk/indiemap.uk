export const load = async ({locals, setHeaders}) => {
  const cachedCounties = await locals.container.cache.memo(
    'all-counties',
    () => locals.container.townService.countiesWithBusiness(),
  )

  setHeaders({
    'x-cached-counties': cachedCounties.isCached ? 'true' : 'false',
  })

  return {
    counties: cachedCounties.value,
  }
}
