import {type BusinessType} from '@i/core/business'
import {type LinkCreateType, LinkCRUDListSchema, type LinkType} from '@i/core/link'
import {fail, redirect} from '@sveltejs/kit'
import {valibot} from 'sveltekit-superforms/adapters'
import {message, superValidate} from 'sveltekit-superforms/server'

import type {Actions} from './$types'

export const load = async ({locals, parent}) => {
	const {business}: {business?: BusinessType | null} = await parent()

	if (!business) {
		throw redirect(301, '/admin/businesses')
	}

	const links = (await locals.container.linkService.getByBusinessId(business.id)) ?? []
	const formData = {
		businessId: business.id,
		deletedLinks: [],
		links,
	}
	const form = await superValidate(formData, valibot(LinkCRUDListSchema))

	return {form}
}

export const actions = {
	links: async ({locals, request}) => {
		const form = await superValidate(request, valibot(LinkCRUDListSchema))

		if (!form.valid) {
			console.error('error in links form', form.errors)
			return fail(400, {form})
		}

		try {
			await Promise.all(
				form.data.links.map((link) => {
					if (link.id) {
						return locals.container.linkService.update(link as LinkType)
					} else {
						return locals.container.linkService.create(link as LinkCreateType)
					}
				}),
			)

			if (form.data.deletedLinks?.length) {
				await Promise.all(form.data.deletedLinks.map((link) => locals.container.linkService.delete(link.id)))
			}
		} catch (e) {
			console.error(e)
			return fail(500, {form})
		}

		return message(form, 'Links saved')
	},
} satisfies Actions
