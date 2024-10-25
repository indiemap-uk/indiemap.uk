import * as v from 'valibot'

import {BusinessCreateSchema, BusinessSchema, BusinessUpdateSchema} from './BusinessSchema.js'

export type BusinessType = v.InferOutput<typeof BusinessSchema>
export type BusinessCreateType = v.InferOutput<typeof BusinessCreateSchema>
export type BusinessUpdateType = v.InferOutput<typeof BusinessUpdateSchema>
