import type {BusinessListArgs, BusinessRepository} from './BusinessRepository.js'
import {newBusinessId} from './BusinessSchema.js'
import type {
  BusinessCreateType,
  BusinessIdType,
  BusinessResolvedType,
  BusinessSearchType,
  BusinessType,
} from './BusinessType.js'

export class BusinessRepositoryMemory implements BusinessRepository {
  private businesses: Map<string, BusinessType> = new Map()

  async create(data: BusinessCreateType): Promise<BusinessType> {
    const id = newBusinessId()
    const business: BusinessType = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.businesses.set(id.toString(), business)
    return business
  }

  async delete(id: BusinessIdType): Promise<void> {
    this.businesses.delete(id.toString())
  }

  async getById(id: BusinessIdType, status?: BusinessType['status']): Promise<BusinessResolvedType | null> {
    const business = this.businesses.get(id.toString())
    if (!business) return null
    if (status && business.status !== status) return null

    return business as BusinessResolvedType
  }

  async search(
    query: BusinessSearchType,
    args?: BusinessListArgs,
    status?: BusinessType['status'],
  ): Promise<BusinessResolvedType[]> {
    let results = Array.from(this.businesses.values())

    if (query.name) {
      results = results.filter(b => b.name.toLowerCase().includes(query.name!.toLowerCase()))
    }
    if (query.townId) {
      results = results.filter(b => b.townId === query.townId)
    }
    if (query.status ?? status) {
      const targetStatus = query.status ?? status
      results = results.filter(b => b.status === targetStatus)
    }

    const limit = args?.limit ?? 100
    const offset = args?.offset ?? 0

    return results.slice(offset, offset + limit) as BusinessResolvedType[]
  }

  async update(data: BusinessType): Promise<BusinessResolvedType> {
    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.businesses.set(data.id.toString(), updated)
    return updated as BusinessResolvedType
  }
}
