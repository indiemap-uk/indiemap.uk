import {BusinessService} from '@i/core/business'
import type {LinkService} from '@i/core/link'
import type {SourceRepository} from '@i/core/source'
import type {KVStore} from '@i/repository/KVStore'
import type {MarkdownService} from '@i/summarizer/MarkdownService'
import type {SummarizerService} from '@i/summarizer/SummarizerService'

export interface WorkerServices {
  markdownService: MarkdownService
  kvstore: KVStore
  sourceRepository: SourceRepository
  summarizerService: SummarizerService
  businessService: BusinessService
  linkService: LinkService
}
