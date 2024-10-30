import type {TownSearchResultType, TownType} from './TownType.js'

export interface TownRepository {
	getById(id: number): Promise<TownType>
	/** getRandom is used for generating test data */
	getRandom(): Promise<TownType>
	search(q: string): Promise<TownSearchResultType[]>
}
