import type {BusinessListArgs, BusinessRepository} from './BusinessRepository.js'
import type {
  BusinessIdType,
  BusinessResolvedType,
  BusinessSearchType,
  BusinessType,
  BusinessUserCreateType,
} from './BusinessType.js'

export class BusinessService {
  constructor(private readonly businessRepository: BusinessRepository) {}

  /**
   * Creates a new business
   *
   * @param newBusiness The new business to create
   * @param dates Optional dates to override the current date (used for mass mock data generation)
   */
  async create(newBusiness: BusinessUserCreateType, dates?: {createdAt?: string; updatedAt?: string}) {
    return this.businessRepository.create({
      ...newBusiness,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...dates,
    })
  }

  delete(id: BusinessIdType) {
    return this.businessRepository.delete(id)
  }

  async getById(id: BusinessIdType, status?: BusinessType['status']) {
    return this.businessRepository.getById(id, status)
  }

  async search(query: BusinessSearchType, args?: BusinessListArgs): Promise<BusinessResolvedType[]> {
    return this.businessRepository.search(query, args)
  }

  async update(business: BusinessType) {
    return this.businessRepository.update(business)
  }
}
