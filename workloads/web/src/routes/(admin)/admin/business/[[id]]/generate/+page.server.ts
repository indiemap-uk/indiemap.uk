import type {BusinessUserCreateType} from '@i/core/business'
import type {LinkCreateType} from '@i/core/link'

import {fail, redirect} from '@sveltejs/kit'
import {valibot} from 'sveltekit-superforms/adapters'
import {superValidate} from 'sveltekit-superforms/server'
import * as v from 'valibot'

import type {Actions} from './$types'

const SeedSchema = v.object({
  urls: v.string(),
})

export const load = async () => {
  const form = await superValidate(valibot(SeedSchema))

  return {form}
}

export const actions = {
  default: async ({locals, request}) => {
    const form = await superValidate(request, valibot(SeedSchema))

    if (!form.valid) {
      console.error('error in form', form.errors)
      return fail(400, {form})
    }

    let businessId

    try {
      const urls = form.data.urls.split('\n')
      const summary = await locals.container.summarizerService.summarizeUrls(urls)

      const b: BusinessUserCreateType = {
        description: summary.longDescription,
        generatedFromUrls: urls,
        name: summary.businessTitle,
        status: 'draft',
        townId: null,
      }
      const business = await locals.container.businessService.create(b)

      // Save the URLs we used to generate this business
      await locals.container.kvstore.set(`llmurls:${business.id}`, urls)

      if (summary.links) {
        for (const url of summary.links) {
          const link: LinkCreateType = {
            businessId: business.id,
            url: url,
          }

          await locals.container.linkService.create(link)
        }
      }

      businessId = business.id
    } catch (e) {
      console.error(e)
      return fail(500, {form})
    }

    redirect(303, `/admin/business/${businessId.toString()}`)
  },
} satisfies Actions
