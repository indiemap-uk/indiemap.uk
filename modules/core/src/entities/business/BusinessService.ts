import type {BusinessRepository} from './BusinessRepository.js'
import type {BusinessCreateType} from './BusinessType.js'

export class BusinessService {
	constructor(private readonly businessRepository: BusinessRepository) {}

	async create(newBusiness: BusinessCreateType) {
		return this.businessRepository.create(newBusiness)
	}

	async list() {
		return this.businessRepository.list()
	}
}
