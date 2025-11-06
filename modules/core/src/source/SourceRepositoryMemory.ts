import type {BusinessIdType} from '#business/index.js'
import * as v from 'valibot'
import type {SourceRepository} from './SourceRepository.js'
import {SourceSchema, newSourceId} from './SourceSchema.js'
import type {SourceCreateType, SourceResolvedType, SourceType, SourceUpdateType} from './SourceType.js'

export class SourceRepositoryMemory implements SourceRepository {
  readonly #sources = new Map<string, SourceType>()

  async getById(id: string): Promise<SourceResolvedType | null> {
    const source = this.#sources.get(id)
    if (!source) {
      return null
    }

    return {
      ...source,
      business: undefined,
    }
  }

  async create(data: SourceCreateType): Promise<SourceType> {
    const id = newSourceId()
    const now = new Date().toISOString()

    const source: SourceType = {
      id: id.toString(),
      businessId: data.businessId,
      urls: data.urls,
      createdAt: now,
      updatedAt: now,
    }

    const validatedSource = v.parse(SourceSchema, source)
    this.#sources.set(validatedSource.id, validatedSource)

    return validatedSource
  }

  async delete(id: string): Promise<void> {
    this.#sources.delete(id)
  }

  async getByBusinessId(id: BusinessIdType): Promise<SourceType | null> {
    for (const source of this.#sources.values()) {
      if (source.businessId === id) {
        return source
      }
    }
    return null
  }

  async update(data: SourceUpdateType): Promise<void> {
    const existingSource = this.#sources.get(data.id)
    if (!existingSource) {
      return
    }

    const updatedSource: SourceType = {
      ...existingSource,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.#sources.set(data.id, updatedSource)
  }

  async search(params: {hasBusiness?: boolean} = {}): Promise<SourceResolvedType[]> {
    const sources = Array.from(this.#sources.values())

    let filtered = sources
    if (params.hasBusiness === true) {
      filtered = sources.filter(source => source.businessId != null)
    } else if (params.hasBusiness === false) {
      filtered = sources.filter(source => source.businessId == null)
    }

    return filtered
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 100)
      .map(source => ({
        ...source,
        business: undefined,
      }))
  }
}
