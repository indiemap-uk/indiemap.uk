import type {TownRepository} from './TownRepository.js'
import type {TownSearchResultType, TownSearchType} from './TownType.js'

export class TownService {
	constructor(private readonly townRepository: TownRepository) {}

	async search(q: TownSearchType): Promise<TownSearchResultType[]> {
		return this.townRepository.search(q)
	}
}
