import type {BusinessIdType} from '../business/BusinessType.js'
import type {GeocodingResultType} from '../geocoding/GeocodingType.js'
import type {LocationRepository} from './LocationRepository.js'
import type {LocationIdType, LocationType, LocationUserCreateType} from './LocationType.js'

export class LocationService {
	constructor(private readonly locationRepository: LocationRepository) {}

	async create(newLocation: LocationUserCreateType, geocodingResult: GeocodingResultType) {
		return this.locationRepository.create({...newLocation, ...geocodingResult})
	}

	delete(id: LocationIdType) {
		return this.locationRepository.delete(id)
	}

	async getByBusinessId(id: BusinessIdType) {
		return this.locationRepository.getByBusinessId(id)
	}

	async update(location: LocationType) {
		await this.locationRepository.update(location)
	}
}
