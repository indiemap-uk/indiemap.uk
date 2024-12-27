export const load = async ({locals}) => {
	const businesses = await locals.container.businessService.list({
		limit: 20,
		order: {
			by: 'createdAt',
			direction: 'DESC',
		},
	})

	return {
		businesses,
	}
}
