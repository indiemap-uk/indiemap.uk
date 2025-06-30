import * as v from 'valibot'

import {TypeIDSchema} from '../../id/TypeIDSchema.js'
import {newIdFn} from '../../id/newIdFn.js'
import {BusinessIdSchema} from '../business/BusinessId.js'

const linkIdPrefix = 'lnk'
export const LinkIdSchema = TypeIDSchema(linkIdPrefix)
export const newLinkId = newIdFn(linkIdPrefix)

export const LinkSchema = v.object({
  businessId: BusinessIdSchema,
  id: LinkIdSchema,
  label: v.nullable(v.pipe(v.string(), v.trim())),
  url: v.pipe(v.string(), v.trim(), v.url(), v.maxLength(250)),
})

export const LinkCRUDSchema = v.object({
  ...LinkSchema.entries,
  id: v.optional(LinkSchema.entries.id),
})

/**
 * The schema to edit a list of links.
 */
export const LinkCRUDListSchema = v.object({
  businessId: BusinessIdSchema,
  deletedLinks: v.array(LinkSchema),
  links: v.array(LinkCRUDSchema),
})

export const LinkCreateSchema = v.omit(LinkSchema, ['id'])
