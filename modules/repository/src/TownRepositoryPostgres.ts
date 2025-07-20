import {
  type TownListArgsType,
  type TownRepository,
  type TownSearchResultType,
  type TownType,
  TownListArgsSchema,
  TownNameSearchSchema,
  TownSchema,
  TownSearchResultSchema,
} from '@i/core/town'
import Big from 'big.js'
import Debug from 'debug'
import * as v from 'valibot'

const debug = Debug('indie:repository:town')

import {asc, count, desc, eq, gte, ilike, sql} from 'drizzle-orm'
import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {businesses, ukTowns} from './db/schema/schema.js'

export class TownRepositoryPostgres extends CRUDRepositoryPostgres implements TownRepository {
  async getById(id: number) {
    const records = await this.db
      .select()
      .from(ukTowns)
      .where(eq(ukTowns.id, id))
      .limit(1)

    return this.toSchema(this.ensure1(records))
  }

  async getRandom() {
    const records = await this.db
      .select()
      .from(ukTowns)
      .orderBy(sql`random()`)
      .limit(1)

    return this.toSchema(this.ensure1(records))
  }

  async getRandoms(count: number) {
    const records = await this.db
      .select()
      .from(ukTowns)
      .orderBy(sql`random()`)
      .limit(count)

    return records.map(this.toSchema)
  }

  /**
   * @param qInput the first 3+ characters of the town name
   * @param hasBusiness when true only returns towns that have businesses
   */
  async search(args: {
    q: string
    hasBusiness?: boolean
    limit?: number
  }): Promise<TownSearchResultType[]> {
    const q = v.parse(TownNameSearchSchema, args.q)
    const {hasBusiness = false, limit = 25} = args
    const shape = {
      id: ukTowns.id,
      name: ukTowns.name,
      county: ukTowns.county,
      latitude: ukTowns.latitude,
      longitude: ukTowns.longitude,
    }

    let records: any[] = []

    if (!hasBusiness) {
      records = await this.db
        .select(shape)
        .from(ukTowns)
        .where(ilike(ukTowns.name, `${q}%`))
        .limit(limit)
    }

    if (hasBusiness) {
      records = await this.db
        .select(shape)
        .from(ukTowns)
        .where(ilike(ukTowns.name, `${q}%`))
        .innerJoin(businesses, eq(businesses.townId, ukTowns.id))
        .limit(limit)
    }

    return records.map((r) =>
      v.parse(TownSearchResultSchema, {
        ...r,
        latitude: Big(r.latitude as string).toNumber(),
        longitude: Big(r.longitude as string).toNumber(),
      })
    )
  }

  /* Since create is only used for mock data, we don't really care about validation */
  async create(town: TownType): Promise<TownType> {
    await this.db.insert(ukTowns).values({
      ...town,
      latitude: town.latitude.toString(),
      longitude: town.longitude.toString(),
    })

    debug(`created town with id ${town.id}`)

    return this.getById(town.id)
  }

  async townsWithBusiness(userArgs?: TownListArgsType): Promise<Array<TownType & {businessCount: number}>> {
    const args = v.parse(TownListArgsSchema, userArgs ?? {})

    // Determine order
    let orderColumn
    switch (args.order.by) {
      case 'businessCount':
        orderColumn = count(businesses.id)
        break
      case 'name':
        orderColumn = ukTowns.name
        break
      default:
        orderColumn = count(businesses.id)
    }
    const orderDirection = args.order.direction === 'DESC' ? desc(orderColumn) : asc(orderColumn)

    const records = await this.db
      .select({
        uk_towns: ukTowns,
        business_count: count(businesses.id).as('business_count'),
      })
      .from(ukTowns)
      .innerJoin(businesses, eq(businesses.townId, ukTowns.id))
      .where(eq(businesses.status, 'live'))
      .groupBy(ukTowns.id, ukTowns.name, ukTowns.county, ukTowns.country)
      .having(gte(count(businesses.id), 1))
      .orderBy(orderDirection)
      .limit(args.limit)
      .offset(args.offset)

    // drizzle-orm returns { uk_towns: ... } when using .select(ukTowns)
    return records.map((r) => {
      const town = this.toSchema(r.uk_towns)
      return {
        ...town,
        businessCount: r.business_count,
      }
    })
  }

  private toSchema = (record: typeof ukTowns.$inferSelect) => {
    try {
      return v.parse(TownSchema, {
        ...record,
        latitude: Big(record.latitude ?? 0).toNumber(),
        longitude: Big(record.longitude ?? 0).toNumber(),
      })
    } catch (error: unknown) {
      if (v.isValiError(error)) {
        console.error('Validation error', v.summarize(error.issues))
        throw new Error(`Valibot error`)
      } else {
        throw error
      }
    }
  }
}
