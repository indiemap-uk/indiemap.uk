import {parseSchema} from '@i/core/schema'
import type {Task} from 'graphile-worker'

import {SourceSchema} from '@i/core/source'
import type {WorkerServices} from '../Services.js'

/**
 * Watch the kv store for all markdown content to be fetced from all URLs.
 * Once they are done, this task kicks off another one to summarize the content.
 */
export const watchMarkdown = (s: WorkerServices): Task => async (payload, h) => {
  const p = parseSchema(SourceSchema, payload)
  h.logger.info(`URLs: ${p.urls}`)

  const markdowns = await Promise.all(p.urls.map(async (url) => {
    return s.kvstore.get<string>(`md:${url}`)
  }))
  h.logger.info(`Markdowns: ${markdowns}`)

  // Force the job to restart if any markdown is missing
  if (markdowns.some(m => m === undefined || m === null)) {
    throw new Error(`Missing markdown content for ${p.urls}`)
  }

  await h.addJob('makeBusinessSummary', {source: p, markdowns})
}
