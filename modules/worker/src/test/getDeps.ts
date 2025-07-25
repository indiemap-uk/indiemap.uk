import {type BusinessRepository, BusinessService} from '@i/core/business'
import {type LinkRepository, LinkService} from '@i/core/link'
import {type ProductRepository, ProductService} from '@i/core/product'
import {type SourceRepository, SourceService} from '@i/core/source'
import {BusinessRepositoryMemory} from '@i/repository/BusinessRepositoryMemory'
import {KVStoreMemory} from '@i/repository/KVStoreMemory'
import {LinkRepositoryMemory} from '@i/repository/LinkRepositoryMemory'
import {ProductRepositoryMemory} from '@i/repository/ProductRepositoryMemory'
import {SourceRepositoryMemory} from '@i/repository/SourceRepositoryMemory'
import {MarkdownServiceMock} from '@i/summarizer/MarkdownServiceMock'
import {SummarizerServiceMock} from '@i/summarizer/SummarizerServiceMock'
import type {TaskDeps} from '../TaskDeps.js'

type Defaults =
  & Partial<TaskDeps>
  & Partial<{
    businessRepository: BusinessRepository
    linkRepository: LinkRepository
    productRepository: ProductRepository
    sourceRepository: SourceRepository
  }>

export const getDeps = (defaults?: Defaults): TaskDeps => {
  const businessRepository = defaults?.businessRepository ?? new BusinessRepositoryMemory()
  const linkRepository = defaults?.linkRepository ?? new LinkRepositoryMemory()
  const productRepository = defaults?.productRepository ?? new ProductRepositoryMemory()
  const sourceRepository = defaults?.sourceRepository ?? new SourceRepositoryMemory()

  return {
    businessService: defaults?.businessService ?? new BusinessService(businessRepository),
    kvstore: defaults?.kvstore ?? new KVStoreMemory(),
    linkService: defaults?.linkService ?? new LinkService(linkRepository),
    markdownService: defaults?.markdownService ?? new MarkdownServiceMock(),
    productService: defaults?.productService ?? new ProductService(productRepository),
    sourceService: defaults?.sourceService ?? new SourceService(sourceRepository),
    summarizerService: defaults?.summarizerService ?? new SummarizerServiceMock(),
  }
}
