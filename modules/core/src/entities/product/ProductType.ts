import * as v from 'valibot'

import {
  ProductCRUDListSchema,
  ProductCRUDSchema,
  ProductCreateSchema,
  ProductSchema,
  ProductUpdateSchema,
} from './ProductSchema.js'

export type ProductCreateType = v.InferOutput<typeof ProductCreateSchema>
export type ProductCRUDListType = v.InferOutput<typeof ProductCRUDListSchema>
export type ProductCRUDType = v.InferOutput<typeof ProductCRUDSchema>
export type ProductType = v.InferOutput<typeof ProductSchema>
export type ProductUpdateType = v.InferOutput<typeof ProductUpdateSchema>
