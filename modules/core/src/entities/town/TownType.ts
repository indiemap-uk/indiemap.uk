import * as v from 'valibot'

import {TownSchema, type TownSearchResultSchema, TownSearchSchema} from './TownSchema.js'

export type TownType = v.InferOutput<typeof TownSchema>

export type TownSearchType = v.InferOutput<typeof TownSearchSchema>

export type TownSearchResultType = v.InferOutput<typeof TownSearchResultSchema>
