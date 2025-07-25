import {parseSchema} from '@i/core/schema'
import crypto from 'crypto'

import type {Task} from 'graphile-worker'
import * as v from 'valibot'

import type {BusinessUserCreateType} from '@i/core/business'
import type {LinkCreateType} from '@i/core/link'
import type {ProductCreateType} from '@i/core/product'
import {SourceSchema} from '@i/core/source'
import type {TaskDeps} from '../TaskDeps.js'

export const MakeBusinessSummaryPayloadSchema = v.object({
  source: SourceSchema,
  markdowns: v.array(v.string()),
})

/**
 * Creates a business from an LLM summary using the markdowns provided
 */
export const makeBusinessFromSummary = (s: TaskDeps): Task => async (payload, h) => {
  const p = parseSchema(MakeBusinessSummaryPayloadSchema, payload)

  const summary = await s.summarizerService.makeBusinessSummary(p.markdowns)

  const urlHash = crypto.createHash('md5').update(p.source.urls.join(',')).digest('hex')
  const key = `llmsummary:${urlHash}`
  await s.kvstore.set(key, summary)

  const b: BusinessUserCreateType = {
    description: summary.longDescription,
    name: summary.businessTitle,
    status: 'draft',
    townId: null,
  }
  const business = await s.businessService.create(b)

  // Record the business ID in the Source
  await s.sourceService.update({
    id: p.source.id,
    urls: p.source.urls,
    businessId: business.id,
  })

  const urls = s.linkService.filterOutContentSubpages([
    // Set => unique only
    ...new Set<string>([
      ...summary.links ?? [],
      ...p.source.urls ?? [],
    ]),
  ])

  for (const url of urls) {
    const link: LinkCreateType = {
      businessId: business.id,
      url: url,
    }

    await s.linkService.create(link)
  }

  for (const product of summary.products ?? []) {
    const p: ProductCreateType = {
      businessId: business.id,
      originalName: product,
    }

    await s.productService.create(p)
  }

  h.logger.info(`Business created: ${business}`)
}
