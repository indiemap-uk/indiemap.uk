import {
  type TownListArgsType,
  type TownRepository,
  type TownSearchResultType,
  type TownType,
  TownListArgsSchema,
  TownNameSearchSchema,
  TownSchema,
} from '@i/core/town'
import * as v from 'valibot'

export class TownRepositoryMemory implements TownRepository {
  readonly #towns = new Map<number, TownType>()
  readonly #businessCountByTownId = new Map<number, number>()

  async getById(id: number): Promise<TownType> {
    const town = this.#towns.get(id)
    if (!town) {
      throw new Error(`Town with id ${id} not found`)
    }
    return town
  }

  async getRandom(): Promise<TownType> {
    const towns = Array.from(this.#towns.values())
    if (towns.length === 0) {
      throw new Error('No towns available')
    }
    const randomIndex = Math.floor(Math.random() * towns.length)

    return towns[randomIndex] as TownType
  }

  async getRandoms(count: number): Promise<TownType[]> {
    const towns = Array.from(this.#towns.values())
    if (towns.length === 0) {
      return []
    }

    // Shuffle array and take first 'count' items
    const shuffled = [...towns].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  async search(args: {
    q: string
    hasBusiness?: boolean
    limit?: number
  }): Promise<TownSearchResultType[]> {
    const q = v.parse(TownNameSearchSchema, args.q)
    const {hasBusiness = false, limit = 25} = args

    let towns = Array.from(this.#towns.values())

    // Filter by name prefix (case insensitive)
    towns = towns.filter(town => town.name.toLowerCase().startsWith(q.toLowerCase()))

    // Filter by business requirement
    if (hasBusiness) {
      towns = towns.filter(town => (this.#businessCountByTownId.get(town.id) ?? 0) > 0)
    }

    // Apply limit
    towns = towns.slice(0, limit)

    // Transform to search result format
    return towns.map(town => ({
      id: town.id,
      name: town.name,
      county: town.county,
      latitude: town.latitude,
      longitude: town.longitude,
    }))
  }

  async create(town: TownType): Promise<TownType> {
    const validatedTown = v.parse(TownSchema, town)
    this.#towns.set(validatedTown.id, validatedTown)
    return validatedTown
  }

  async townsWithBusiness(userArgs?: TownListArgsType): Promise<Array<TownType & {businessCount: number}>> {
    const args = v.parse(TownListArgsSchema, userArgs ?? {})

    // Get towns that have businesses
    let townsWithBusinesses = Array.from(this.#towns.values())
      .filter(town => (this.#businessCountByTownId.get(town.id) ?? 0) >= 1)
      .map(town => ({
        ...town,
        businessCount: this.#businessCountByTownId.get(town.id) ?? 0,
      }))

    // Apply sorting
    const sortField = args.order.by === 'name' ? 'name' : 'businessCount'
    const isDescending = args.order.direction === 'DESC'

    townsWithBusinesses.sort((a, b) => {
      let comparison = 0
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else {
        comparison = a.businessCount - b.businessCount
      }
      return isDescending ? -comparison : comparison
    })

    // Apply pagination
    return townsWithBusinesses.slice(args.offset, args.offset + args.limit)
  }

  async countiesWithBusiness(): Promise<string[]> {
    // Get unique counties from towns that have businesses
    const counties = new Set<string>()

    Array.from(this.#towns.values())
      .filter(town => (this.#businessCountByTownId.get(town.id) ?? 0) >= 1)
      .forEach(town => {
        if (town.county) {
          counties.add(town.county)
        }
      })

    return Array.from(counties).sort()
  }

  // Helper method to set business counts (for testing/setup)
  setBusinessCount(townId: number, count: number): void {
    this.#businessCountByTownId.set(townId, count)
  }

  // Helper method to clear all data
  clear(): void {
    this.#towns.clear()
    this.#businessCountByTownId.clear()
  }
}
