import type {BusinessRepository} from './BusinessRepository.js'
import type {BusinessCreateType, BusinessIdType, BusinessType} from './BusinessType.js'

export class BusinessService {
	constructor(private readonly businessRepository: BusinessRepository) {}

	async create(newBusiness: BusinessCreateType) {
		return this.businessRepository.create(newBusiness)
	}

	delete(id: BusinessIdType) {
		return this.businessRepository.delete(id)
	}

	async getById(id: BusinessIdType) {
		return this.businessRepository.getById(id)
	}

	async list() {
		return this.businessRepository.list()
	}

	async update(business: BusinessType) {
		return this.businessRepository.update(business)
	}
}
