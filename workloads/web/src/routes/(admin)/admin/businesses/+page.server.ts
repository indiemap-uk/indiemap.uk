export const load = async ({locals, url}: {locals: App.Locals; url: URL}) => {
  const {businessService} = locals.container

  const statusParam = url.searchParams.get('status')
  const statusFilter = statusParam === 'live' || statusParam === 'draft' ? statusParam : undefined

  const businesses = await businessService.search(
    {status: statusFilter},
    {
      limit: 25,
      order: {
        by: 'createdAt',
        direction: 'DESC',
      },
    },
  )

  return {
    businesses,
    status: statusParam,
  }
}
