import * as v from 'valibot'

import {BusinessIdSchema} from './BusinessId.js'
import {
  BusinessCRUDSchema,
  BusinessCreateSchema,
  BusinessListArgsSchema,
  BusinessResolvedSchema,
  BusinessSchema,
  BusinessSearchSchema,
  BusinessUserCreateSchema,
} from './BusinessSchema.js'

export type BusinessCreateType = v.InferOutput<typeof BusinessCreateSchema>
export type BusinessCRUDType = v.InferOutput<typeof BusinessCRUDSchema>
export type BusinessIdType = v.InferOutput<typeof BusinessIdSchema>
export type BusinessListArgsTYpe = v.InferOutput<typeof BusinessListArgsSchema>
export type BusinessResolvedType = v.InferOutput<typeof BusinessResolvedSchema>
export type BusinessSearchType = v.InferOutput<typeof BusinessSearchSchema>
export type BusinessType = v.InferOutput<typeof BusinessSchema>
export type BusinessUserCreateType = v.InferOutput<typeof BusinessUserCreateSchema>
