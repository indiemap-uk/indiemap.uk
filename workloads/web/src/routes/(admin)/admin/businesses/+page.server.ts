export const load = async ({locals}: {locals: App.Locals}) => {
	const {businessService} = locals.container

	const businesses = await businessService.list()

	return {
		businesses,
	}
}
