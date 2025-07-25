import * as v from 'valibot'

/**
 * Geocoding results (address to lat/long),
 * retured from a geocoding service.
 */
export const GeocodingResultSchema = v.object({
  latitude: v.pipe(
    v.number('Latitude missing'),
    v.minValue(-90, 'Latitude too low'),
    v.maxValue(90, 'Latitude too high'),
  ),
  longitude: v.pipe(
    v.number('Longitude missing'),
    v.minValue(-180, 'Longitude too low'),
    v.maxValue(180, 'Longitude too high'),
  ),
})
