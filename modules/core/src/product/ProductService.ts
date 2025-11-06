import type {ProductRepository} from './ProductRepository.js'
import type {ProductCreateType, ProductType, ProductUpdateType} from './ProductType.js'

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(newProduct: ProductCreateType) {
    return this.productRepository.create(newProduct)
  }

  delete(id: string) {
    return this.productRepository.delete(id)
  }

  async getById(id: string): Promise<ProductType | null> {
    return this.productRepository.getById(id)
  }

  async update(product: ProductUpdateType) {
    await this.productRepository.update(product)
  }

  async getByBusinessId(businessId: string): Promise<ProductType[] | null> {
    return this.productRepository.getByBusinessId(businessId)
  }
}
