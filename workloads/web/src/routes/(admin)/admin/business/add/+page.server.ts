import {BusinessCreateSchema} from '@i/core/business'
import {fail} from '@sveltejs/kit'
import {message, superValidate} from 'sveltekit-superforms'
import {valibot} from 'sveltekit-superforms/adapters'

import type {Actions} from './$types'

export const load = async () => {
	const form = await superValidate(valibot(BusinessCreateSchema))

	return {form}
}

export const actions = {
	add: async ({locals, request}) => {
		const form = await superValidate(request, valibot(BusinessCreateSchema))

		if (!form.valid) {
			return fail(400, {form})
		}

		try {
			await locals.container.businessService.create(form.data)
		} catch (error) {
			console.error(error)
			return fail(500, {form})
		}

		return message(form, 'New business created')
	},
} satisfies Actions
