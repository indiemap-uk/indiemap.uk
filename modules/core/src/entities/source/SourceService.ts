import type {BusinessIdType} from '../business/BusinessType.js'
import type {SourceRepository} from './SourceRepository.js'
import type {SourceCreateType, SourceType} from './SourceType.js'

export class SourceService {
  constructor(private readonly sourceRepository: SourceRepository) {}

  async create(newSource: SourceCreateType) {
    return this.sourceRepository.create(newSource)
  }

  delete(id: string) {
    return this.sourceRepository.delete(id)
  }

  async getByBusinessId(id: BusinessIdType) {
    return this.sourceRepository.getByBusinessId(id)
  }

  async update(source: SourceType) {
    await this.sourceRepository.update(source)
  }
}
