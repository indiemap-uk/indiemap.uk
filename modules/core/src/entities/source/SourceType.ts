import * as v from 'valibot'

import {SourceCreateSchema, SourceResolvedSchema, SourceSchema, SourceUpdateSchema} from './SourceSchema.js'

export type SourceCreateType = v.InferOutput<typeof SourceCreateSchema>
export type SourceResolvedType = v.InferOutput<typeof SourceResolvedSchema>
export type SourceType = v.InferOutput<typeof SourceSchema>
export type SourceUpdateType = v.InferOutput<typeof SourceUpdateSchema>
