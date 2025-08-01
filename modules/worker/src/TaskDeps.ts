import {BusinessService} from '@i/core/business'
import type {LinkService} from '@i/core/link'
import type {ProductService} from '@i/core/product'
import type {SourceService} from '@i/core/source'
import type {SummarizerService} from '@i/core/summarizer'
import type {TownService} from '@i/core/town'
import type {KVStore} from '@i/repository/KVStore'
import type {MarkdownService} from '@i/summarizer/MarkdownService'

export interface TaskDeps {
  businessService: BusinessService
  kvstore: KVStore
  linkService: LinkService
  markdownService: MarkdownService
  productService: ProductService
  sourceService: SourceService
  summarizerService: SummarizerService
  townService: TownService
}
