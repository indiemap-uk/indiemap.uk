import * as v from 'valibot'

import {BusinessIdSchema} from './BusinessId.js'
import {BusinessCreateSchema, BusinessCRUDSchema, BusinessResolvedSchema, BusinessSchema} from './BusinessSchema.js'

export type BusinessCreateType = v.InferOutput<typeof BusinessCreateSchema>
export type BusinessCRUDType = v.InferOutput<typeof BusinessCRUDSchema>
export type BusinessIdType = v.InferOutput<typeof BusinessIdSchema>
export type BusinessResolvedType = v.InferOutput<typeof BusinessResolvedSchema>
export type BusinessType = v.InferOutput<typeof BusinessSchema>
