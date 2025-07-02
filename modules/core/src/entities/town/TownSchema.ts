import * as v from 'valibot'

import {NameSearchSchema} from '../NameSearchSchema.js'

export const TownSchema = v.object({
  country: v.string(),
  county: v.string(),
  easting: v.number(),
  elevation: v.number(),
  gridReference: v.string(),
  id: v.pipe(v.number(), v.minValue(1), v.maxValue(50_000)),
  latitude: v.number(),
  localGovernmentArea: v.string(),
  longitude: v.number(),
  name: v.string(),
  northing: v.number(),
  nutsRegion: v.string(),
  postcodeSector: v.string(),
  type: v.string(),
})

export const TownNameSearchSchema = NameSearchSchema
export const TownIDSearchSchema = v.pipe(v.number(), v.minValue(1), v.maxValue(99_999))

export const TownSearchResultSchema = v.pick(TownSchema, ['id', 'name', 'county', 'latitude', 'longitude'])
