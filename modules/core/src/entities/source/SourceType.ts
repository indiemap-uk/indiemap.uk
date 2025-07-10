import * as v from 'valibot'

import {SourceCreateSchema, SourceSchema} from './SourceSchema.js'

export type SourceCreateType = v.InferOutput<typeof SourceCreateSchema>
export type SourceType = v.InferOutput<typeof SourceSchema>
