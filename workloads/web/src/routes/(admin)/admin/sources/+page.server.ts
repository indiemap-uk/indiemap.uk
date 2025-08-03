export const load = async ({locals, url}: {locals: App.Locals; url: URL}) => {
  const {sourceService, noteService} = locals.container

  const withBusinessParam = url.searchParams.get('withBusiness')
  const hasBusiness = withBusinessParam === 'true' ? true : withBusinessParam === 'false' ? false : undefined

  const sources = await sourceService.search({hasBusiness})

  // Fetch notes for all sources
  const sourcesWithNotes = await Promise.all(
    sources.map(async (source) => {
      const notes = await noteService.getByEntityId('source', source.id)
      return {...source, notes}
    }),
  )

  return {
    sources: sourcesWithNotes,
    withBusiness: withBusinessParam,
  }
}
