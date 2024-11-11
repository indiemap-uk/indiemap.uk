import * as v from 'valibot'

import type {
	LocationCreateSchema,
	LocationCRUDListSchema,
	LocationIdSchema,
	LocationSchema,
	LocationUserCreateSchema,
} from './LocationSchema.js'

export type LocationIdType = v.InferOutput<typeof LocationIdSchema>
export type LocationCreateType = v.InferOutput<typeof LocationCreateSchema>
export type LocationUserCreateType = v.InferOutput<typeof LocationUserCreateSchema>
export type LocationType = v.InferOutput<typeof LocationSchema>
export type LocationCRUDListType = v.InferOutput<typeof LocationCRUDListSchema>
