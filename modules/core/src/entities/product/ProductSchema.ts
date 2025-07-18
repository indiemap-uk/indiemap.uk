import * as v from 'valibot'
import {newIdFn} from '../../id/newIdFn.js'
import {TimestampSchema} from '../TimestampSchemas.js'

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
