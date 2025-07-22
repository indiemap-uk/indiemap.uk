export const load = async ({locals, url}: {locals: App.Locals; url: URL}) => {
  const {sourceService} = locals.container

  const withBusinessParam = url.searchParams.get('withBusiness')
  const hasBusiness = withBusinessParam === 'true' ? true : withBusinessParam === 'false' ? false : undefined

  const sources = await sourceService.search({hasBusiness})

  return {
    sources,
    withBusiness: withBusinessParam,
  }
}
