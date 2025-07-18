import * as v from 'valibot'

import {ProductCreateSchema, ProductSchema, ProductUpdateSchema} from './ProductSchema.js'

export type ProductCreateType = v.InferOutput<typeof ProductCreateSchema>
export type ProductType = v.InferOutput<typeof ProductSchema>
export type ProductUpdateType = v.InferOutput<typeof ProductUpdateSchema>
