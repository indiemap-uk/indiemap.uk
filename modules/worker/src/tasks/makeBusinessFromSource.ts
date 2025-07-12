import {parseSchema} from '@i/core/schema'
import type {Task} from 'graphile-worker'

import {SourceSchema} from '@i/core/source'

/**
 * THIS IS THE ENTRY POINT / INITIAL TASK FOR MAKING A BUSINESS FROM A SOURCE
 *
 * Takes a Source ID and kicks off a saga to generate a business from the URLs.
 *
 * Reminder: a Source is a list of URLs
 */
export const makeBusinessFromSource = (): Task => async (payload, h) => {
  const p = parseSchema(SourceSchema, payload)
  h.logger.info(`Source: ${p}`)

  await h.addJob('fetchMarkdown', p.urls)
  // wait 5 seconds
  await h.addJob('watchMarkdown', p, {runAt: new Date(Date.now() + 5000)})
}
