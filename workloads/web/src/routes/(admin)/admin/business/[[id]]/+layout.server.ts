import {BusinessIdSchema} from '@i/core/business'
import {error} from '@sveltejs/kit'
import * as v from 'valibot'

import type {LayoutServerLoad} from './$types'

export const load: LayoutServerLoad = async ({locals, params}) => {
  if (!params?.id) {
    return {
      business: null,
    }
  }

  // ID provided = edit business form
  const {businessService} = locals.container
  const business = await businessService.getById(v.parse(BusinessIdSchema, params.id))
  if (!business) {
    throw error(404, 'Business not found')
  }

  return {
    business,
  }
}
