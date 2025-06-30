import * as v from 'valibot'

import type {
  LocationCRUDListSchema,
  LocationCreateSchema,
  LocationIdSchema,
  LocationSchema,
  LocationUserCreateSchema,
} from './LocationSchema.js'

export type LocationCreateType = v.InferOutput<typeof LocationCreateSchema>
export type LocationCRUDListType = v.InferOutput<typeof LocationCRUDListSchema>
export type LocationIdType = v.InferOutput<typeof LocationIdSchema>
export type LocationType = v.InferOutput<typeof LocationSchema>
export type LocationUserCreateType = v.InferOutput<typeof LocationUserCreateSchema>
