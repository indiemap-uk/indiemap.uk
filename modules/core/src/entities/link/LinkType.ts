import * as v from 'valibot'

import {LinkCreateSchema, LinkSchema, LinkUpdateSchema} from './LinkSchema.js'

export type LinkType = v.InferOutput<typeof LinkSchema>
export type LinkCreateType = v.InferOutput<typeof LinkCreateSchema>
export type LinkUpdateType = v.InferOutput<typeof LinkUpdateSchema>
