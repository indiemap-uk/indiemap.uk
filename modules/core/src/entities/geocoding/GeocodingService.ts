import type {GeocodingResultType} from './GeocodingType.js'

export interface GeocodingService {
	geocode(address: string): Promise<GeocodingResultType>
}
