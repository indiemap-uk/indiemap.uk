import * as v from 'valibot'

import {TownNameSearchSchema, TownSchema, type TownSearchResultSchema} from './TownSchema.js'

export type TownNameSearchType = v.InferOutput<typeof TownNameSearchSchema>

export type TownSearchResultType = v.InferOutput<typeof TownSearchResultSchema>

export type TownType = v.InferOutput<typeof TownSchema>
