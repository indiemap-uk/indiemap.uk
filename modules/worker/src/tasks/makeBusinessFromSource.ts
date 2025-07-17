import {parseSchema} from '@i/core/schema'
import type {Task} from 'graphile-worker'

import {SourceSchema} from '@i/core/source'
import type {WorkerServices} from '../Services.js'

/**
 * THIS IS THE ENTRY POINT / INITIAL TASK FOR MAKING A BUSINESS FROM A SOURCE
 *
 * Takes a Source ID and kicks off a saga to generate a business from the URLs.
 *
 * Reminder: a Source is a list of URLs
 */
export const makeBusinessFromSource = (s: WorkerServices): Task => async (payload, h) => {
  const p = parseSchema(SourceSchema, payload)
  h.logger.info(`Source: ${p}`)

  const contentUrls = s.sourceService.contentUrlsOnly(p.urls)

  await h.addJob('fetchMarkdown', contentUrls)
  await h.addJob('watchMarkdown', {originalSource: p, urlsToWatch: contentUrls}, {runAt: new Date(Date.now() + 2500)}) // Watch is delayed
}
