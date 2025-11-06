import * as v from 'valibot'

import {newIdFn} from '#schema/newIdFn.js'

const linkIdPrefix = 'lnk'
export const LinkIdSchema = v.string()
export const newLinkId = newIdFn(linkIdPrefix)

export const LinkSchema = v.object({
  businessId: v.string(),
  id: LinkIdSchema,
  label: v.nullish(v.pipe(v.string(), v.trim())),
  url: v.pipe(v.string(), v.trim(), v.url(), v.maxLength(250)),
  order: v.number(),
})

export const LinkCRUDSchema = v.object({
  ...LinkSchema.entries,
  id: v.optional(LinkSchema.entries.id),
  order: v.optional(LinkSchema.entries.order),
})

/**
 * The schema to edit a list of links.
 */
export const LinkCRUDListSchema = v.object({
  businessId: v.string(),
  deletedLinks: v.array(LinkSchema),
  links: v.array(LinkCRUDSchema),
})

export const LinkCreateSchema = v.omit(LinkSchema, ['id'])
