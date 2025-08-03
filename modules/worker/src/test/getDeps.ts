import {type BusinessRepository, BusinessService} from '@i/core/business'
import {type LinkRepository, LinkService} from '@i/core/link'
import {type NoteRepository, NoteService} from '@i/core/note'
import {type ProductRepository, ProductService} from '@i/core/product'
import {type SourceRepository, SourceService} from '@i/core/source'
import {type TownRepository, TownService} from '@i/core/town'
import {BusinessRepositoryMemory} from '@i/repository/BusinessRepositoryMemory'
import {KVStoreMemory} from '@i/repository/KVStoreMemory'
import {LinkRepositoryMemory} from '@i/repository/LinkRepositoryMemory'
import {NoteRepositoryMemory} from '@i/repository/NoteRepositoryMemory'
import {ProductRepositoryMemory} from '@i/repository/ProductRepositoryMemory'
import {SourceRepositoryMemory} from '@i/repository/SourceRepositoryMemory'
import {TownRepositoryMemory} from '@i/repository/TownRepositoryMemory'
import {MarkdownServiceMock} from '@i/summarizer/MarkdownServiceMock'
import {SummarizerServiceMock} from '@i/summarizer/SummarizerServiceMock'
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
