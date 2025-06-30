import * as v from 'valibot'

/**
 * Geocoding results (address to lat/long),
 * retured from a geocoding service.
 */
export const GeocodingResultSchema = v.object({
  latitude: v.number('Latitude missing'),
  longitude: v.number('Longitude missing'),
})
