import {eq} from 'drizzle-orm'
import * as v from 'valibot'

import type {BusinessIdType} from '#business/index.js'
import {CRUDRepositoryPostgres} from '#db/CRUDRepositoryPostgres.js'
import {links} from '#db/schema/schema.js'
import type {LinkRepository} from './LinkRepository.js'
import {LinkCreateSchema, LinkSchema, newLinkId} from './LinkSchema.js'
import type {LinkCreateType, LinkIdType, LinkType} from './LinkType.js'

export class LinkRepositoryPostgres extends CRUDRepositoryPostgres implements LinkRepository {
  async create(data: LinkCreateType) {
    const validatedData = v.parse(LinkCreateSchema, data)
    const id = newLinkId()

    const toInsert = {
      ...validatedData,
      id: id.toString(),
      businessId: validatedData.businessId.toString(),
    }

    const record = await this.db
      .insert(links)
      .values(toInsert)
      .returning()

    return v.parse(LinkSchema, record[0])
  }

  async delete(id: LinkIdType) {
    await this.db
      .delete(links)
      .where(eq(links.id, id.toString()))
  }

  async getByBusinessId(id: BusinessIdType) {
    const records = await this.db
      .select()
      .from(links)
      .where(eq(links.businessId, id.toString()))
      .orderBy(links.order)

    return records.map((r) =>
      v.parse(LinkSchema, {
        ...r,
        id: r.id,
        businessId: r.businessId,
      })
    )
  }

  async update(data: LinkType): Promise<void> {
    const validatedData = v.parse(LinkSchema, data)

    await this.db
      .update(links)
      .set({
        ...validatedData,
        id: validatedData.id.toString(),
        businessId: validatedData.businessId.toString(),
      })
      .where(eq(links.id, validatedData.id.toString()))
  }
}
