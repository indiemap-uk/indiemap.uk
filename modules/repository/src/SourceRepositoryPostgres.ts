import {
  type SourceCreateType,
  type SourceRepository,
  type SourceType,
  SourceCreateSchema,
  SourceSchema,
  newSourceId,
} from '@i/core/source'
import {eq} from 'drizzle-orm'
import * as v from 'valibot'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {sources} from './db/schema/schema.js'

export class SourceRepositoryPostgres extends CRUDRepositoryPostgres implements SourceRepository {
  async create(data: SourceCreateType) {
    const validatedData = v.parse(SourceCreateSchema, data)
    const id = newSourceId()

    const toInsert = {
      id: id.toString(),
      businessId: validatedData.businessId,
      urls: validatedData.urls,
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

  async getById(id: string) {
    const record = await this.db
      .select()
      .from(sources)
      .where(eq(sources.id, id))
      .limit(1)

    if (record.length === 0) {
      return null
    }

    return v.parse(SourceSchema, record[0])
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

  async update(data: SourceType): Promise<void> {
    const validatedData = v.parse(SourceSchema, data)

    await this.db
      .update(sources)
      .set(validatedData)
      .where(eq(sources.id, validatedData.id))
  }
}
