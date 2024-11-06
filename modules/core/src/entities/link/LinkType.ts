import * as v from 'valibot'

import {
	LinkCreateSchema,
	LinkCRUDListSchema,
	LinkCRUDSchema,
	LinkIdSchema,
	LinkSchema,
	LinkUpdateSchema,
} from './LinkSchema.js'

export type LinkType = v.InferOutput<typeof LinkSchema>
export type LinkIdType = v.InferOutput<typeof LinkIdSchema>
export type LinkCRUDType = v.InferOutput<typeof LinkCRUDSchema>
export type LinkCRUDListType = v.InferOutput<typeof LinkCRUDListSchema>
export type LinkCreateType = v.InferOutput<typeof LinkCreateSchema>
export type LinkUpdateType = v.InferOutput<typeof LinkUpdateSchema>
