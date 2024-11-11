import type {BusinessType} from '@i/core/business'

import {
	type LocationCreateType,
	LocationCRUDListSchema,
	LocationSchema,
	type LocationService,
	type LocationType,
	type LocationUserCreateType,
} from '@i/core/location'
import {type Actions, redirect} from '@sveltejs/kit'
import {fail, message, superValidate} from 'sveltekit-superforms'
import {valibot} from 'sveltekit-superforms/adapters'
import * as v from 'valibot'

export const load = async ({locals, parent}) => {
	const {business}: {business?: BusinessType | null} = await parent()

	if (!business) {
		throw redirect(301, '/admin/businesses')
	}

	const locationService: LocationService = locals.container.locationService

	const locations = await locationService.getByBusinessId(business.id)

	const formData = {
		businessId: business.id,
		deletedLocations: [],
		locations,
	}
	const form = await superValidate(formData, valibot(LocationCRUDListSchema))

	return {form}
}

export const actions = {
	locations: async ({locals, request}) => {
		const form = await superValidate(request, valibot(LocationCRUDListSchema))

		if (!form.valid) {
			console.error('error in locations form', form.errors)
			return fail(400, {form})
		}

		try {
			await Promise.all(
				form.data.locations.map((location) => {
					if (v.is(LocationSchema, location)) {
						return locals.container.locationService.update(location)
					} else {
						return locals.container.locationService.create(location)
					}
				}),
			)

			if (form.data.deletedLocations?.length) {
				await Promise.all(
					form.data.deletedLocations.map((location) => locals.container.locationService.delete(location.id)),
				)
			}
		} catch (e) {
			console.error(e)
			return fail(500, {form})
		}

		return message(form, 'Locations saved')
	},
} satisfies Actions
