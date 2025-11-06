import type {ProductRepository} from './ProductRepository.js'
import {newProductId} from './ProductSchema.js'
import type {ProductCreateType, ProductType, ProductUpdateType} from './ProductType.js'

export class ProductRepositoryMemory implements ProductRepository {
  private products: Map<string, ProductType> = new Map()

  async getById(id: string): Promise<ProductType | null> {
    return this.products.get(id) ?? null
  }

  async create(data: ProductCreateType): Promise<ProductType> {
    const id = newProductId()
    const product: ProductType = {
      ...data,
      id: id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.products.set(id.toString(), product)
    return product
  }

  async delete(id: string): Promise<void> {
    this.products.delete(id)
  }

  async update(data: ProductUpdateType): Promise<void> {
    const existing = this.products.get(data.id)
    if (!existing) return

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.products.set(data.id, updated)
  }

  async getByBusinessId(businessId: string): Promise<ProductType[]> {
    return Array.from(this.products.values()).filter(
      product => product.businessId === businessId,
    )
  }
}
