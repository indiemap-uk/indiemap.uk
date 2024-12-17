export const load = async ({locals}) => {
	const businesses = locals.container.businessService.list({
		limit: 20,
		order: {by: 'updatedAt', direction: 'DESC'},
	})

	return {
		businesses,
	}
}
