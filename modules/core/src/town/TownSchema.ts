import * as v from 'valibot'

import {NameSearchSchema} from '#schema/NameSearchSchema.js'

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

export const TownListArgsSchema = v.object({
  limit: v.optional(v.number(), 10),
  offset: v.optional(v.number(), 0),
  order: v.optional(
    v.object({
      by: v.optional(v.picklist(['businessCount', 'name']), 'businessCount'),
      direction: v.optional(v.picklist(['ASC', 'DESC']), 'DESC'),
    }),
    {by: 'businessCount', direction: 'DESC'},
  ),
})
