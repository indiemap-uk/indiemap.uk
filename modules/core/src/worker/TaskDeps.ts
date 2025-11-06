import {BusinessService} from '#business/index.js'
import type {KVStore} from '#kvStore/index.js'
import type {LinkService} from '#link/index.js'
import type {Logger} from '#logger/index.js'
import type {NoteService} from '#note/index.js'
import type {ProductService} from '#product/index.js'
import type {SourceService} from '#source/index.js'
import type {SummarizerService} from '#summarizer/index.js'
import type {MarkdownService} from '#summarizer/services/MarkdownService.js'
import type {TownService} from '#town/index.js'

export interface TaskDeps {
  businessService: BusinessService
  kvstore: KVStore
  linkService: LinkService
  logger: Logger
  markdownService: MarkdownService
  noteService: NoteService
  productService: ProductService
  sourceService: SourceService
  summarizerService: SummarizerService
  townService: TownService
}
