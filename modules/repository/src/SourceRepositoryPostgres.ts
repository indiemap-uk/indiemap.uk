import {parseSchema} from '@i/core/schema'
import {
  type SourceCreateType,
  type SourceRepository,
  type SourceResolvedType,
  type SourceUpdateType,
  SourceCreateSchema,
  SourceResolvedSchema,
  SourceSchema,
  SourceUpdateSchema,
  newSourceId,
} from '@i/core/source'
import {and, desc, eq, isNotNull, isNull} from 'drizzle-orm'
import * as v from 'valibot'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {businesses, sources} from './db/schema/schema.js'

export class SourceRepositoryPostgres extends CRUDRepositoryPostgres implements SourceRepository {
  async create(data: SourceCreateType) {
    const validatedData = v.parse(SourceCreateSchema, data)
    const id = newSourceId()
    const now = new Date().toISOString()

    const toInsert = {
      id: id.toString(),
      businessId: validatedData.businessId,
      urls: validatedData.urls,
      createdAt: now,
      updatedAt: now,
    }

    const record = await this.db
      .insert(sources)
      .values(toInsert)
      .returning()

    return v.parse(SourceSchema, record[0])
  }

  async delete(id: string) {
    await this.db
      .delete(sources)
      .where(eq(sources.id, id))
  }

  async getById(id: string): Promise<SourceResolvedType | null> {
    const records = await this.db
      .select({
        source: sources,
        business: businesses,
      })
      .from(sources)
      .leftJoin(businesses, eq(sources.businessId, businesses.id))
      .where(eq(sources.id, id))
      .limit(1)

    if (records.length === 0) {
      return null
    }

    return this.toResolvedSourceSchema(this.ensure1(records))
  }

  async getByBusinessId(id: string) {
    const records = await this.db
      .select()
      .from(sources)
      .where(eq(sources.businessId, id.toString()))
      .limit(1)

    if (records.length === 0) {
      return null
    }

    return v.parse(SourceSchema, records[0])
  }

  async update(data: SourceUpdateType) {
    const validatedData = v.parse(SourceUpdateSchema, data)
    const now = new Date().toISOString()

    await this.db
      .update(sources)
      .set({
        ...validatedData,
        updatedAt: now,
      })
      .where(eq(sources.id, validatedData.id))
  }

  async search(params: {hasBusiness?: boolean} = {}): Promise<SourceResolvedType[]> {
    const conditions = []
    if (params.hasBusiness === true) {
      conditions.push(isNotNull(sources.businessId))
    } else if (params.hasBusiness === false) {
      conditions.push(isNull(sources.businessId))
    }

    const records = await this.db
      .select({
        source: sources,
        business: businesses,
      })
      .from(sources)
      .orderBy(desc(sources.updatedAt))
      .leftJoin(businesses, eq(sources.businessId, businesses.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(100)

    return records.map(record => this.toResolvedSourceSchema(record))
  }

  private toResolvedSourceSchema(record: {
    source: typeof sources.$inferSelect
    business: typeof businesses.$inferSelect | null
  }): SourceResolvedType {
    const businessData = record.business
      ? {
        id: record.business.id,
        name: record.business.name,
        description: record.business.description,
        status: record.business.status,
        townId: record.business.townId,
        createdAt: record.business.createdAt,
        updatedAt: record.business.updatedAt,
      }
      : undefined

    return parseSchema(SourceResolvedSchema, {
      business: businessData,
      ...record.source,
    })
  }
}
