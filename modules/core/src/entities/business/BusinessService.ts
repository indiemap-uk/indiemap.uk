import type {BusinessListArgs, BusinessRepository} from './BusinessRepository.js'
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

	async list(args?: BusinessListArgs) {
		return this.businessRepository.list(args)
	}

	async update(business: BusinessType) {
		return this.businessRepository.update(business)
	}
}
