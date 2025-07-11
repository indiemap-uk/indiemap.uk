import {type BusinessListArgs, type BusinessSearchType, BusinessSearchSchema} from '@i/core/business'
import {error, json} from '@sveltejs/kit'
import Debug from 'debug'
import * as v from 'valibot'

const debug = Debug('indie:web:business-search')

/**
 * The public business search route.
 *
 * We do not allow setting the `status`, it's always `live`
 * (so draft businesses are not returned).
 */
export const GET = async ({locals, url}) => {
  const q: BusinessSearchType = {
    name: url.searchParams.get('name'),
    // Force the status to be live
    status: 'live',
    // 1+ number or nothing
    townId: Number(url.searchParams.get('townId')) || null,
  }
  debug(`q %j`, q)

  const qParse = v.safeParse(BusinessSearchSchema, q)

  if (qParse.issues) {
    error(400, qParse.issues.map((i) => `${i.path?.[0].key}: ${i.message}`).join(', '))
  }

  // Handle pagination parameters
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const offset = parseInt(url.searchParams.get('offset') || '0')
  const orderBy = url.searchParams.get('orderBy') || 'name'
  const orderDirection = url.searchParams.get('orderDirection') || 'ASC'

  const args: BusinessListArgs = {
    limit,
    offset,
    order: {
      by: orderBy as keyof BusinessSearchType,
      direction: orderDirection as 'ASC' | 'DESC',
    },
  }

  const results = await locals.container.businessRepository.search(qParse.output, args)

  return json({
    businesses: results,
    offset,
    limit,
    hasMore: results.length === limit,
  })
}
