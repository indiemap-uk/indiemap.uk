import type {BusinessRepository} from './BusinessRepository.js'
import type {BusinessCreateType} from './BusinessType.js'

export class BusinessService {
	constructor(private readonly businessRepository: BusinessRepository) {}

	async create(b: BusinessCreateType) {
		return this.businessRepository.create({
			...b,
			links: [],
		})
	}
}
