import type {
  BusinessCreateType,
  BusinessIdType,
  BusinessListArgs,
  BusinessRepository,
  BusinessResolvedType,
  BusinessSearchType,
  BusinessType,
} from '@i/core/business'
import {
  BusinessCreateSchema,
  BusinessListArgsSchema,
  BusinessResolvedSchema,
  BusinessSchema,
  BusinessSearchSchema,
  newBusinessId,
} from '@i/core/business'
import {parseSchema} from '@i/core/schema'
import {and, asc, desc, eq, ilike, inArray, or} from 'drizzle-orm'
import * as v from 'valibot'
import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {businesses, ukTowns} from './db/schema/schema.js'

export class BusinessRepositoryPostgres extends CRUDRepositoryPostgres implements BusinessRepository {
  async create(data: BusinessCreateType): Promise<BusinessType> {
    const validatedData = v.parse(BusinessCreateSchema, data)
    const id = newBusinessId()

    const toInsert = {
      ...validatedData,
      id: id.toString(),
    }

    await this.db
      .insert(businesses)
      .values(toInsert)

    return this.getByIdSafe(id)
  }

  async delete(id: BusinessIdType): Promise<void> {
    await this.db
      .delete(businesses)
      .where(eq(businesses.id, id.toString()))
  }

  async getByIdSafe(id: BusinessIdType, status?: BusinessType['status']): Promise<BusinessResolvedType> {
    const business = await this.getById(id, status)
    if (!business) {
      throw new Error(`Business with id ${id} not found`)
    }

    return business
  }

  async getById(id: BusinessIdType, status?: BusinessType['status']): Promise<BusinessResolvedType | null> {
    const conditions = [eq(businesses.id, id.toString())]

    if (status) {
      conditions.push(eq(businesses.status, status))
    }

    const records = await this.db.query.businesses.findMany({
      with: {
        town: true,
        products: true,
        links: true,
        locations: {
          with: {
            location: true,
          },
        },
      },
      where: and(...conditions),
      limit: 1,
    })

    if (records.length === 0) {
      return null
    }

    const record = this.ensure1(records)
    const entity = {
      ...record,
      locations: record.locations.map(location => location.location),
    }

    return parseSchema(BusinessResolvedSchema, entity)
  }

  async search(
    userQuery: BusinessSearchType,
    userArgs: BusinessListArgs = {},
  ): Promise<BusinessResolvedType[]> {
    const query = v.parse(BusinessSearchSchema, userQuery)
    const args = v.parse(BusinessListArgsSchema, userArgs) as Required<BusinessListArgs>

    const conditions = []

    if (query.name) {
      conditions.push(ilike(businesses.name, `${query.name.toLowerCase()}%`))
    }

    if (query.townId) {
      conditions.push(eq(businesses.townId, query.townId))
    }

    if (query.county && query.townIds && query.townIds.length > 0) {
      conditions.push(
        or(
          eq(businesses.county, query.county),
          inArray(businesses.townId, query.townIds),
        ),
      )
    }

    if (!query.county && query.townIds && query.townIds.length > 0) {
      conditions.push(inArray(businesses.townId, query.townIds))
    }

    if (query.status) {
      conditions.push(eq(businesses.status, query.status))
    }

    // Determine order
    let orderColumn
    switch (args.order.by) {
      case 'name':
        orderColumn = businesses.name
        break
      case 'status':
        orderColumn = businesses.status
        break
      case 'createdAt':
        orderColumn = businesses.createdAt
        break
      case 'updatedAt':
        orderColumn = businesses.updatedAt
        break
      default:
        orderColumn = businesses.id
    }
    const orderDirection = args.order.direction === 'DESC' ? desc(orderColumn) : asc(orderColumn)

    const records = await this.db
      .select({
        business: businesses,
        town: ukTowns,
      })
      .from(businesses)
      .leftJoin(ukTowns, eq(businesses.townId, ukTowns.id))
      .where(and(...conditions))
      .orderBy(orderDirection)
      .limit(args.limit)
      .offset(args.offset)

    return records.map(record => this.toResolvedBusinessSchema(record))
  }

  async update(data: BusinessType): Promise<BusinessResolvedType> {
    const validatedData = v.parse(BusinessSchema, data)

    await this.db
      .update(businesses)
      .set({
        ...validatedData,
        id: validatedData.id.toString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(businesses.id, data.id.toString()))

    return this.getByIdSafe(validatedData.id)
  }

  private toResolvedBusinessSchema(record: {
    business: typeof businesses.$inferSelect
    town: typeof ukTowns.$inferSelect | null
  }): BusinessResolvedType {
    const townData = record.town
      ? {
        id: record.town.id,
        name: record.town.name,
        county: record.town.county,
        country: record.town.country,
        gridReference: record.town.gridReference,
        easting: record.town.easting,
        northing: record.town.northing,
        latitude: record.town.latitude,
        longitude: record.town.longitude,
        elevation: record.town.elevation,
        postcodeSector: record.town.postcodeSector,
        localGovernmentArea: record.town.localGovernmentArea,
        nutsRegion: record.town.nutsRegion,
        type: record.town.type,
      }
      : undefined

    return parseSchema(BusinessResolvedSchema, {
      ...record.business,
      town: townData,
    })
  }
}
