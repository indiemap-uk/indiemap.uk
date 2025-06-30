import type {TownSearchResultType, TownType} from './TownType.js'

export interface TownRepository {
  getById(id: number): Promise<TownType>
  /** Returns a random town */
  getRandom(): Promise<TownType>
  /** Returns a bunch of random towns */
  getRandoms(count: number): Promise<TownType[]>
  search(q: string, hasBusiness?: boolean): Promise<TownSearchResultType[]>
}
