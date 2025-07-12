export const load = async ({locals}: {locals: App.Locals}) => {
  const {sourceService} = locals.container

  const sources = await sourceService.search()

  return {
    sources,
  }
}
