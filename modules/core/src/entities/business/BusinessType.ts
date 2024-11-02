import * as v from 'valibot'

import {BusinessIdSchema} from './BusinessId.js'
import {BusinessCreateSchema, BusinessCRUDSchema, BusinessSchema} from './BusinessSchema.js'

export type BusinessIdType = v.InferOutput<typeof BusinessIdSchema>
export type BusinessType = v.InferOutput<typeof BusinessSchema>
export type BusinessCreateType = v.InferOutput<typeof BusinessCreateSchema>
export type BusinessCRUDType = v.InferOutput<typeof BusinessCRUDSchema>
