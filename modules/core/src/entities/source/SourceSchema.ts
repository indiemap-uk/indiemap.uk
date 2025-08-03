import * as v from 'valibot'

import {newIdFn} from '../../id/newIdFn.js'
import {TimestampSchema} from '../TimestampSchemas.js'
import {BusinessSchema} from '../business/BusinessSchema.js'

const sourceIdPrefix = 'src'
export const newSourceId = newIdFn(sourceIdPrefix)

export const SourceSchema = v.object({
  businessId: v.nullish(v.string()),
  id: v.string(),
  name: v.nullish(v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, 'At least two characters'),
    v.maxLength(100, 'At most 100 characters'),
  )),
  urls: v.array(v.pipe(v.string(), v.trim(), v.url(), v.maxLength(250))),
  ...TimestampSchema.entries,
})

export const SourceCreateSchema = v.omit(SourceSchema, ['id', 'createdAt', 'updatedAt'])
export const SourceUpdateSchema = v.omit(SourceSchema, ['createdAt', 'updatedAt'])

export const SourceResolvedSchema = v.object({
  ...SourceSchema.entries,
  business: v.optional(BusinessSchema),
})
