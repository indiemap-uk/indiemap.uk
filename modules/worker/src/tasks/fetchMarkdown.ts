import {parseSchema} from '@i/core/schema'
import type {Task} from 'graphile-worker'
import * as v from 'valibot'

import type {TaskDeps} from '../TaskDeps.js'

const PayloadSchema = v.array(v.pipe(v.string(), v.url()))

/**
 * Fetch and cache the markdown for all URLs
 *
 * Takes an array of URLs, so this is "batch mode"!
 * If any promise rejects in the returned array then this job will re-start with the failed URLs.
 * See https://worker.graphile.org/docs/library/add-job#batch-jobs
 */
export const fetchMarkdown = (s: TaskDeps): Task => async (payload, helpers) => {
  const urls = parseSchema(PayloadSchema, payload)
  helpers.logger.info(`URLs: ${urls}`)

  return urls.map(async (url) => {
    helpers.logger.info(`processing url ${url}`)
    const cached = await s.kvstore.get(`md:${url}`)
    if (cached) {
      return
    }

    const markdown = await s.markdownService.get(url)
    await s.kvstore.set(`md:${url}`, markdown)
  })
}
