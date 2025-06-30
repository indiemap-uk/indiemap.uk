import type {TownRepository} from './TownRepository.js'
import type {TownNameSearchType, TownSearchResultType, TownType} from './TownType.js'

export class TownService {
  constructor(private readonly townRepository: TownRepository) {}

  async getById(id: number): Promise<TownType> {
    return this.townRepository.getById(id)
  }

  getRandom() {
    return this.townRepository.getRandom()
  }

  getRandoms(count: number) {
    return this.townRepository.getRandoms(count)
  }

  async search(q: TownNameSearchType, hasBusiness = false): Promise<TownSearchResultType[]> {
    return this.townRepository.search(q, hasBusiness)
  }
}
