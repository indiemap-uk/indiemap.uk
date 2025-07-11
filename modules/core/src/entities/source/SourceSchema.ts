import * as v from 'valibot'

import {newIdFn} from '../../id/newIdFn.js'
import {BusinessSchema} from '../business/BusinessSchema.js'

const sourceIdPrefix = 'src'
export const newSourceId = newIdFn(sourceIdPrefix)

export const SourceSchema = v.object({
  businessId: v.nullish(v.string()),
  id: v.string(),
  urls: v.array(v.pipe(v.string(), v.trim(), v.url(), v.maxLength(250))),
})

export const SourceCreateSchema = v.omit(SourceSchema, ['id'])

export const SourceResolvedSchema = v.object({
  ...SourceSchema.entries,
  business: v.optional(BusinessSchema),
})
