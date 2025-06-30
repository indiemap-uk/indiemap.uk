import {type GeocodingResultType, type GeocodingService, GeocodingResultSchema} from '@i/core/geocoding'
import Debug from 'debug'
import ky from 'ky'
import * as v from 'valibot'

import type {Root} from './GeocodifyTypes.js'

//  Documentation: https://geocodify.com/api-documentation
export class GeocodingServiceGeocodify implements GeocodingService {
  private readonly debug: Debug.Debugger

  constructor(private readonly apiKey: string) {
    this.debug = Debug('indie:GeocodingServiceGeocodify')
  }

  public async geocode(address: string): Promise<GeocodingResultType> {
    this.debug('Address: %s', address)

    const response = await ky<Root>(`https://api.geocodify.com/v2/geocode`, {
      searchParams: {
        api_key: this.apiKey,
        q: address,
      },
    }).json()
    this.debug('Response: %o', response)

    const coords = response.response.features[0]?.geometry.coordinates
    this.debug('Coordinates: %o', coords)

    if (!coords) {
      throw new Error('No coordinates found')
    }

    // The result is GeoJSON, so the two numbers are [longitude and latitude]. See https://datatracker.ietf.org/doc/html/rfc7946
    return v.parse(GeocodingResultSchema, {
      latitude: coords[1],
      longitude: coords[0],
    })
  }

  /**
   * Return 0,0 (instead of throwing) if the address cannot be geocoded.
   */
  public async safeGeocode(address: string): Promise<GeocodingResultType> {
    try {
      const res = await this.geocode(address)

      return res
    } catch (error) {
      this.debug('Error: %o', error)
      this.debug('Returning 0,0')
      return {
        latitude: 0,
        longitude: 0,
      }
    }
  }
}
