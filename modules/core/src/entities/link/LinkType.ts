import * as v from 'valibot'

import {LinkCRUDListSchema, LinkCRUDSchema, LinkCreateSchema, LinkIdSchema, LinkSchema} from './LinkSchema.js'

export type LinkCreateType = v.InferOutput<typeof LinkCreateSchema>
export type LinkCRUDListType = v.InferOutput<typeof LinkCRUDListSchema>
export type LinkCRUDType = v.InferOutput<typeof LinkCRUDSchema>
export type LinkIdType = v.InferOutput<typeof LinkIdSchema>
export type LinkType = v.InferOutput<typeof LinkSchema>
