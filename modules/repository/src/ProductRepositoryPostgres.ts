import {
  type ProductCreateType,
  type ProductRepository,
  type ProductType,
  type ProductUpdateType,
  ProductCreateSchema,
  ProductSchema,
  ProductUpdateSchema,
  newProductId,
} from '@i/core/product'
import {parseSchema} from '@i/core/schema'
import {eq} from 'drizzle-orm'
import * as v from 'valibot'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {products} from './db/schema/schema.js'

export class ProductRepositoryPostgres extends CRUDRepositoryPostgres implements ProductRepository {
  async create(data: ProductCreateType) {
    const validatedData = v.parse(ProductCreateSchema, data)
    const id = newProductId()
    const now = new Date().toISOString()

    const toInsert = {
      id: id.toString(),
      originalName: validatedData.originalName,
      businessId: validatedData.businessId,
      createdAt: now,
      updatedAt: now,
    } satisfies ProductType

    const record = await this.db
      .insert(products)
      .values(toInsert)
      .returning()

    return v.parse(ProductSchema, record[0])
  }

  async delete(id: string) {
    await this.db
      .delete(products)
      .where(eq(products.id, id))
  }

  async getById(id: string): Promise<ProductType | null> {
    const records = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)

    if (records.length === 0) {
      return null
    }

    return parseSchema(ProductSchema, this.ensure1(records))
  }

  async update(data: ProductUpdateType) {
    const validatedData = v.parse(ProductUpdateSchema, data)
    const now = new Date().toISOString()

    await this.db
      .update(products)
      .set({
        ...validatedData,
        updatedAt: now,
      })
      .where(eq(products.id, validatedData.id))
  }

  async getByBusinessId(businessId: string): Promise<ProductType[]> {
    const records = await this.db
      .select()
      .from(products)
      .where(eq(products.businessId, businessId))

    return records.map(record => v.parse(ProductSchema, record))
  }
}
