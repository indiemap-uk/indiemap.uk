import {BusinessService} from '@i/core/business'
import type {LinkService} from '@i/core/link'
import type {ProductService} from '@i/core/product'
import type {SourceRepository, SourceService} from '@i/core/source'
import type {KVStore} from '@i/repository/KVStore'
import type {MarkdownService} from '@i/summarizer/MarkdownService'
import type {SummarizerService} from '@i/summarizer/SummarizerService'

export interface WorkerServices {
  markdownService: MarkdownService
  kvstore: KVStore
  sourceRepository: SourceRepository
  sourceService: SourceService
  summarizerService: SummarizerService
  businessService: BusinessService
  linkService: LinkService
  productService: ProductService
}
