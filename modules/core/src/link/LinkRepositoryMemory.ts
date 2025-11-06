import type {BusinessIdType} from '#business/index.js'
import type {LinkRepository} from './LinkRepository.js'
import {newLinkId} from './LinkSchema.js'
import type {LinkCreateType, LinkIdType, LinkType} from './LinkType.js'

export class LinkRepositoryMemory implements LinkRepository {
  private links: Map<string, LinkType> = new Map()

  async create(data: LinkCreateType): Promise<LinkType> {
    const id = newLinkId()
    const link: LinkType = {
      ...data,
      id,
    }

    this.links.set(id.toString(), link)
    return link
  }

  async delete(id: LinkIdType): Promise<void> {
    this.links.delete(id.toString())
  }

  async getByBusinessId(businessId: BusinessIdType): Promise<LinkType[]> {
    return Array.from(this.links.values()).filter(
      link => link.businessId === businessId,
    )
  }

  async update(data: LinkType): Promise<void> {
    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.links.set(data.id.toString(), updated)
  }
}
