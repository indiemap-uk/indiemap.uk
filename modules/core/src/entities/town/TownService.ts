import type {TownSearchResultType, TownSearchType} from './TownType.js'

import {TownRepository} from './TownRepository.js'

export class TownService {
	constructor(private readonly townRepository: TownRepository) {}

	async search(q: TownSearchType): Promise<TownSearchResultType[]> {
		return this.townRepository.search(q)
	}
}
