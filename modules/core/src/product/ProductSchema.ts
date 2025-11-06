import {TimestampSchema} from '#schema/TimestampSchemas.js'
import {newIdFn} from '#schema/newIdFn.js'
import * as v from 'valibot'

const productIdPrefix = 'prod'
export const newProductId = newIdFn(productIdPrefix)

export const ProductSchema = v.object({
  id: v.string(),
  originalName: v.string(),
  businessId: v.string(),
  ...TimestampSchema.entries,
})

export const ProductCreateSchema = v.omit(ProductSchema, ['id', 'createdAt', 'updatedAt'])
export const ProductUpdateSchema = v.omit(ProductSchema, ['createdAt', 'updatedAt'])

export const ProductCRUDSchema = v.object({
  ...ProductCreateSchema.entries,
  id: v.optional(v.string()),
})

/**
 * The schema to edit a list of products.
 */
export const ProductCRUDListSchema = v.object({
  businessId: v.string(),
  deletedProductIds: v.array(v.string()),
  products: v.array(ProductSchema),
  newProducts: v.array(ProductCreateSchema),
})
