import {parseSchema} from '@i/core/schema'
import crypto from 'crypto'

import type {Task} from 'graphile-worker'
import * as v from 'valibot'

import type {BusinessUserCreateType} from '@i/core/business'
import type {LinkCreateType} from '@i/core/link'
import {SourceSchema} from '@i/core/source'
import type {WorkerServices} from '../Services.js'

const PayloadSchema = v.object({
  source: SourceSchema,
  markdowns: v.array(v.string()),
})

/**
 * Creates a business from an LLM summary using the markdowns provided
 */
export const makeBusinessFromSummary = (s: WorkerServices): Task => async (payload, h) => {
  const p = parseSchema(PayloadSchema, payload)

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
  await s.sourceRepository.update({
    id: p.source.id,
    urls: p.source.urls,
    businessId: business.id,
  })

  const urls = new Set<string>([
    ...summary.links ?? [],
    ...s.sourceService.nonContentUrlsOnly(p.source.urls),
  ])

  for (const url of urls) {
    const link: LinkCreateType = {
      businessId: business.id,
      url: url,
    }

    await s.linkService.create(link)
  }

  h.logger.info(`Business created: ${business}`)
}
