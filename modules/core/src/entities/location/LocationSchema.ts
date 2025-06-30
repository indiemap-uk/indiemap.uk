import * as v from 'valibot'

import {TypeIDSchema} from '../../id/TypeIDSchema.js'
import {newIdFn} from '../../id/newIdFn.js'
import {BusinessIdSchema} from '../business/BusinessId.js'
import {GeocodingResultSchema} from '../geocoding/GeocodingSchema.js'

const locationIdPrefix = 'loc'
export const LocationIdSchema = TypeIDSchema(locationIdPrefix)
export const newLocationId = newIdFn(locationIdPrefix)

/**
 * The core properties for a Location
 */
const LocationCoreSchema = v.object({
  address: v.pipe(v.string(), v.trim(), v.maxLength(300)),
  businessId: BusinessIdSchema,
  id: LocationIdSchema,
  label: v.nullable(v.pipe(v.string(), v.trim(), v.maxLength(50))),
})

/**
 * The schema the user provides to create a location.
 * It lacks geocoding results, as those will be generated based on the user-provided address.
 */
export const LocationUserCreateSchema = v.omit(
  v.object({
    ...LocationCoreSchema.entries,
    businessId: BusinessIdSchema,
  }),
  ['id'],
)

/**
 * The fully built schema of a Location entity
 */
export const LocationSchema = v.object({
  ...LocationCoreSchema.entries,
  ...GeocodingResultSchema.entries,
})

/**
 * The schema sent to the repository to persist a new Location
 */
export const LocationCreateSchema = v.omit(LocationSchema, ['id'])

export const LocationCRUDSchema = v.object({
  ...LocationSchema.entries,
  id: v.optional(LocationSchema.entries.id),
  latitude: v.optional(LocationSchema.entries.latitude),
  longitude: v.optional(LocationSchema.entries.longitude),
})

/**
 * The schema to edit a list of locations.
 */
export const LocationCRUDListSchema = v.object({
  businessId: BusinessIdSchema,
  deletedLocations: v.array(LocationSchema),
  locations: v.array(LocationCRUDSchema),
})
