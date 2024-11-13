import type {BusinessIdType} from '../business/BusinessType.js'
import type {GeocodingServiceInterface} from '../geocoding/GeocodingServiceInterface.js'
import type {LocationRepository} from './LocationRepository.js'
import type {GeocodingResultType, LocationIdType, LocationType, LocationUserCreateType} from './LocationType.js'

export class LocationService {
	constructor(
		private readonly locationRepository: LocationRepository,
		private readonly geocodingService: GeocodingServiceInterface,
	) {}

	async create(newLocation: LocationUserCreateType) {
		let geocodingResult: GeocodingResultType = {
			latitude: 0,
			longitude: 0,
		}
		try {
			geocodingResult = await this.geocodingService.geocode(newLocation.address)
		} catch (error) {
			console.error(error)
		}

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