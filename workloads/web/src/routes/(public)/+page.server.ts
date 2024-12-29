export const load = async ({locals}) => {
	const businesses = await locals.container.businessService.search(
		{status: 'live'},
		{
			limit: 20,
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
