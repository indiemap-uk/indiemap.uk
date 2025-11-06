import type {ProductCreateType, ProductType, ProductUpdateType} from './ProductType.js'

export type ProductRepository = {
  getById(id: string): Promise<ProductType | null>
  create(data: ProductCreateType): Promise<ProductType>
  delete(id: string): Promise<void>
  update(data: ProductUpdateType): Promise<void>
  getByBusinessId(businessId: string): Promise<ProductType[]>
}
