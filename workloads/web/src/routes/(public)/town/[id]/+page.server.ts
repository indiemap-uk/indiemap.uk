import {error} from '@sveltejs/kit'

export const load = async ({locals, params}) => {
  const townId = Number(params.id)

  if (!townId || isNaN(townId)) {
    throw error(404, 'Not found')
  }

  const town = await locals.container.townService.getById(townId)
  if (!town) {
    throw error(404, 'Not found')
  }

  const businesses = locals.container.businessService.search({townId})

  return {
    businesses,
    town,
  }
}
