export const load = async ({locals}: {locals: App.Locals}) => {
	const {businessService} = locals.container

	const businesses = await businessService.search(
		{},
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
	}
}
