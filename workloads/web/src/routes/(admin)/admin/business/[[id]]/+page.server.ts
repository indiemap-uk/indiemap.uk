import {
	BusinessCRUDSchema,
	type BusinessCRUDType,
	BusinessIdSchema,
	BusinessSchema,
	type BusinessType,
} from '@i/core/business'
import {error, fail} from '@sveltejs/kit'
import {redirect} from '@sveltejs/kit'
import {message, superValidate} from 'sveltekit-superforms'
import {valibot} from 'sveltekit-superforms/adapters'
import * as v from 'valibot'

import type {Actions, PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals, params}) => {
	// No ID = new business form
	if (!params.id) {
		const form = await superValidate(valibot(BusinessCRUDSchema))

		return {form}
	}

	// ID provided = edit business form
	const {businessService} = locals.container
	const business = await businessService.getById(v.parse(BusinessIdSchema, params.id))

	if (!business) {
		throw error(404, 'Business not found')
	}

	const form = await superValidate(business, valibot(BusinessCRUDSchema))
	return {business, form}
}

export const actions = {
	default: async ({locals, request}) => {
		const formData = await request.formData()
		if (formData.has('delete')) {
			await locals.container.businessService.delete(v.parse(BusinessIdSchema, formData.get('id')))

			return redirect(301, '/admin/businesses')
		}

		const form = await superValidate(request, valibot(BusinessCRUDSchema))

		if (!form.valid) {
			console.error('Invalid form data', form)
			return fail(400, {form})
		}

		if (!form.data.id) {
			// Create new business
			let business
			try {
				business = await locals.container.businessService.create(form.data)
			} catch (error) {
				console.error(error)
				return fail(500, {form})
			}

			return redirect(301, `/admin/business/${business.id.toString()}`)
		} else if (v.is(BusinessSchema, form.data)) {
			// Update existing business
			try {
				await locals.container.businessService.update(form.data)
			} catch (error) {
				console.error(error)
				return fail(500, {form})
			}
		} else {
			// Invalid
			throw new Error('Invalid business data')
		}
	},
} satisfies Actions
