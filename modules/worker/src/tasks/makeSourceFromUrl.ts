import {parseSchema} from '@i/core/schema'
import type {Task} from 'graphile-worker'
import * as v from 'valibot'

import type {WorkerServices} from '../Services.js'

const PayloadSchema = v.pipe(v.string(), v.url())

/**
 * Fetch the markdown for the URL and create a Source entity from the links
 * found on the page
 */
export const makeSourceFromUrl = (s: WorkerServices): Task => async (payload, helpers) => {
  const url = parseSchema(PayloadSchema, payload)
  helpers.logger.info(`URL: ${url}`)

  let markdown: string

  const cached = await s.kvstore.get(`md:${url}`)
  if (cached) {
    markdown = cached
  } else {
    markdown = await s.markdownService.get(url)
    await s.kvstore.set(`md:${url}`, markdown)
  }

  const urls = s.sourceService.getLinksFromMarkdown(markdown)

  const source = await s.sourceService.create({urls})

  helpers.logger.info(`Created source ${source.id} with ${urls.length} urls: ${urls.join(', ')}`)
}
