import {parseSchema} from '@i/core/schema'
import type {Task} from 'graphile-worker'
import * as v from 'valibot'

import type {TaskDeps} from '../TaskDeps.js'

const PayloadSchema = v.object({
  url: v.pipe(v.string(), v.url()),
  notes: v.nullish(v.string()),
  name: v.nullish(v.string()),
})

/**
 * Fetch the markdown for the URL and create a Source entity from the links
 * found on the page
 */
export const makeSourceFromUrl = (s: TaskDeps): Task => async (payload, h) => {
  const {url, notes, name} = parseSchema(PayloadSchema, payload)
  h.logger.info('payload', {payload})

  let markdown: string

  const cached = await s.kvstore.get(`md:${url}`)
  if (cached) {
    h.logger.debug(`cached markdown available`)
    markdown = cached
  } else {
    h.logger.debug(`no cached markdown`)
    markdown = await s.markdownService.get(url)
    h.logger.debug(`markdown fetched`, {markdown})
    await s.kvstore.set(`md:${url}`, markdown)
  }

  const urls = s.sourceService.getLinksFromMarkdown(markdown)
  h.logger.debug(`found ${urls.length} urls`, {urls})

  const source = await s.sourceService.create({urls, name})

  // Create note if provided
  if (notes) {
    await s.noteService.create({
      entityType: 'source',
      entityId: source.id,
      content: notes,
    })
    h.logger.debug(`Created note for source ${source.id}: ${notes}`)
  }

  h.logger.info(`Created source ${source.id} with ${urls.length} urls: ${urls.join(', ')}`)
}
