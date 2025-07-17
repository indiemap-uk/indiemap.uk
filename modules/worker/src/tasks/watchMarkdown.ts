import {parseSchema} from '@i/core/schema'
import type {Task} from 'graphile-worker'

import {SourceSchema} from '@i/core/source'
import * as v from 'valibot'
import type {WorkerServices} from '../Services.js'

const PayloadSchema = v.object({
  originalSource: SourceSchema,
  urlsToWatch: v.array(v.string()),
})

/**
 * Watch the kv store for all markdown content to be fetced from all URLs.
 * Once they are done, this task kicks off another one to summarize the content.
 */
export const watchMarkdown = (s: WorkerServices): Task => async (payload, h) => {
  const p = parseSchema(PayloadSchema, payload)
  h.logger.info(`URLs to watch: ${p.urlsToWatch}`)

  const missing: string[] = []
  const markdowns = await Promise.all(p.urlsToWatch.map(async (url) => {
    const md = await s.kvstore.get<string>(`md:${url}`)

    if (!md) {
      missing.push(url)
    }

    return md
  }))

  // Force the job to restart if any markdown is missing
  if (markdowns.some(m => m === undefined || m === null)) {
    throw new Error(`Missing: ${missing.join(', ')}`)
  }

  await h.addJob('makeBusinessSummary', {source: p.originalSource, markdowns})
}
