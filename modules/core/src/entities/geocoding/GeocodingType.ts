import * as v from 'valibot'

import type {GeocodingResultSchema} from './GeocodingSchema.js'

export type GeocodingResultType = v.InferOutput<typeof GeocodingResultSchema>
