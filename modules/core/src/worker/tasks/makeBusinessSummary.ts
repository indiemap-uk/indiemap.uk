import crypto from 'crypto'

import type {Task} from 'graphile-worker'
import * as v from 'valibot'

import type {BusinessUserCreateType} from '#business/index.js'
import type {LinkCreateType} from '#link/index.js'
import type {ProductCreateType} from '#product/index.js'
import {parseSchema} from '#schema/index.js'
import {SourceSchema} from '#source/index.js'
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

  const urlHash = crypto.createHash('md5').update(p.source.urls.join(',')).digest('hex')
  const promptHash = s.summarizerService.getPromptHash()
  const key = `llmsummary:${urlHash}:${promptHash}`

  // Check for cached summary first
  let summary = await s.kvstore.get(key)

  if (!summary) {
    h.logger.info('No cached summary found, generating new one')
    summary = await s.summarizerService.makeBusinessSummary(p.markdowns)
    await s.kvstore.set(key, summary)
  } else {
    h.logger.info('Using cached summary')
  }

  // Try to find a matching town based on the extracted location data
  let townId: number | null = null
  if (summary.town && summary.county) {
    try {
      const townSearchResults = await s.townService.search(summary.town)
      // Find a town that matches both name and county
      const matchingTown = townSearchResults.find(town =>
        town.name.toLowerCase() === summary.town!.toLowerCase() &&
        town.county.toLowerCase() === summary.county!.toLowerCase()
      )
      if (matchingTown) {
        townId = matchingTown.id
      }
    } catch (error) {
      h.logger.warn(`Failed to find town ${summary.town}, ${summary.county}: ${error}`)
    }
  } else if (summary.town) {
    try {
      const townSearchResults = await s.townService.search(summary.town)
      // If only town name is available, take the first exact match
      const matchingTown = townSearchResults.find(town => town.name.toLowerCase() === summary.town!.toLowerCase())
      if (matchingTown) {
        townId = matchingTown.id
      }
    } catch (error) {
      h.logger.warn(`Failed to find town ${summary.town}: ${error}`)
    }
  }

  const b: BusinessUserCreateType = {
    description: summary.longDescription,
    name: summary.businessTitle,
    status: 'draft',
    townId,
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

  for (const [index, url] of urls.entries()) {
    const link: LinkCreateType = {
      businessId: business.id,
      url: url,
      order: index,
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

  h.logger.info(`Business created: ${business.id} in town: ${townId ?? 'none'}`)
}
