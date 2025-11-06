import {BusinessRepositoryMemory} from '#business/BusinessRepositoryMemory.js'
import {type BusinessRepository, BusinessService} from '#business/index.js'
import {KVStoreMemory} from '#kvStore/index.js'
import {LinkRepositoryMemory} from '#link/LinkRepositoryMemory.js'
import {type LinkRepository, LinkService} from '#link/index.js'
import {NoteRepositoryMemory} from '#note/NoteRepositoryMemory.js'
import {type NoteRepository, NoteService} from '#note/index.js'
import {ProductRepositoryMemory} from '#product/ProductRepositoryMemory.js'
import {type ProductRepository, ProductService} from '#product/index.js'
import {SourceRepositoryMemory} from '#source/SourceRepositoryMemory.js'
import {type SourceRepository, SourceService} from '#source/index.js'
import {SummarizerServiceMock} from '#summarizer/SummarizerServiceMock.js'
import {MarkdownServiceMock} from '#summarizer/services/MarkdownServiceMock.js'
import {TownRepositoryMemory} from '#town/TownRepositoryMemory.js'
import {type TownRepository, TownService} from '#town/index.js'
import {pino} from 'pino'
import type {TaskDeps} from '../TaskDeps.js'

type Defaults =
  & Partial<TaskDeps>
  & Partial<{
    businessRepository: BusinessRepository
    linkRepository: LinkRepository
    productRepository: ProductRepository
    sourceRepository: SourceRepository
    townRepository: TownRepository
    noteRepository: NoteRepository
  }>

export const getDeps = (defaults?: Defaults): TaskDeps => {
  const businessRepository = defaults?.businessRepository ?? new BusinessRepositoryMemory()
  const linkRepository = defaults?.linkRepository ?? new LinkRepositoryMemory()
  const productRepository = defaults?.productRepository ?? new ProductRepositoryMemory()
  const sourceRepository = defaults?.sourceRepository ?? new SourceRepositoryMemory()
  const townRepository = defaults?.townRepository ?? new TownRepositoryMemory()
  const noteRepository = defaults?.noteRepository ?? new NoteRepositoryMemory()

  return {
    businessService: defaults?.businessService ?? new BusinessService(businessRepository),
    kvstore: defaults?.kvstore ?? new KVStoreMemory(),
    linkService: defaults?.linkService ?? new LinkService(linkRepository),
    markdownService: defaults?.markdownService ?? new MarkdownServiceMock(),
    productService: defaults?.productService ?? new ProductService(productRepository),
    sourceService: defaults?.sourceService ?? new SourceService(sourceRepository),
    summarizerService: defaults?.summarizerService ?? new SummarizerServiceMock(),
    townService: defaults?.townService ?? new TownService(townRepository),
    noteService: defaults?.noteService ?? new NoteService(noteRepository),
    logger: pino({level: process.env.LOG_LEVEL ?? 'info'}),
  }
}
