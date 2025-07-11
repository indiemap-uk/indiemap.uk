import type {TownListArgsType, TownSearchResultType, TownType} from './TownType.js'

export interface TownRepository {
  getById(id: number): Promise<TownType>
  /** Returns a random town */
  getRandom(): Promise<TownType>
  /** Returns a bunch of random towns */
  getRandoms(count: number): Promise<TownType[]>
  search(args: {q: string; hasBusiness?: boolean; limit?: number}): Promise<TownSearchResultType[]>
  /** Creates a new town - only used for mock data creation */
  create(town: TownType): Promise<TownType>
  /** Returns all towns with businesses */
  townsWithBusiness(args?: TownListArgsType): Promise<Array<TownType & {businessCount: number}>>
}
