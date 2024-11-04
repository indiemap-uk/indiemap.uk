import type {TownRepository} from './TownRepository.js'
import type {TownSearchResultType, TownSearchType, TownType} from './TownType.js'

export class TownService {
	constructor(private readonly townRepository: TownRepository) {}

	async getById(id: number): Promise<TownType> {
		return this.townRepository.getById(id)
	}

	async search(q: TownSearchType): Promise<TownSearchResultType[]> {
		return this.townRepository.search(q)
	}
}
