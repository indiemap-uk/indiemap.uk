import * as v from 'valibot'

import {TownSchema} from './TownSchema.js'

/** Towns are not editable so we only have a single type */
export type TownType = v.InferOutput<typeof TownSchema>
