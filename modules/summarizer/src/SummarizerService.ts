import type {KVStore} from '@i/repository/KVStore'

import crypto from 'crypto'
import Debug from 'debug'

import type {SummaryResponseType} from './llm/SummaryResponseSchema.js'
import type {MarkdownService} from './services/MarkdownService.js'

import {siteSummaryInstructions} from './llm/propmpts.js'
import {summarizeBusiness} from './llm/summarizeBusiness.js'

const debug = Debug('indie:summarizer:SummarizerService')

/**
 * Service that generates a summary of a business by fetching URLs
 * and passing them to an LLM.
 */
export class SummarizerService {
  private kvstore: KVStore
  private markdownService: MarkdownService
  private openAiApiKey: string

  constructor(kvstore: KVStore, markdownService: MarkdownService, openAiApiKey: string) {
    this.kvstore = kvstore
    this.markdownService = markdownService
    this.openAiApiKey = openAiApiKey
  }

  /**
   * Given a list of URLs, generates a summary of a business.
   */
  public async summarizeUrls(urls: string[]) {
    debug('Starting summarization for %d URLs', urls.length)

    if (!urls.length) {
      throw new Error('No URLs provided. Pass it as $program url1,url2,url3')
    }

    const cachedSummary = await this.getSummary(urls)
    if (cachedSummary) {
      debug('Using cached summary for URLs %o', urls)
      return cachedSummary
    }

    debug('Fetching markdown for URLs: %o', urls)
    const markdowns = await Promise.all(
      urls.map(async (url) => {
        const cached = await this.kvstore.get(`md:${url}`)
        if (cached) {
          debug('Using cached markdown for %s', url)
          return cached
        }

        debug('Fetching markdown for %s', url)
        const markdown = await this.markdownService.get(url)
        await this.kvstore.set(`md:${url}`, markdown)

        return markdown
      }),
    )

    const combinedMarkdown = markdowns.join('\n\n---\n\n')
    debug('Combined markdown length: %d characters', combinedMarkdown.length)

    debug('Calling LLM to summarize business')
    const summary = await summarizeBusiness({
      apiKey: this.openAiApiKey,
      model: 'gpt-4',
      systemPrompt: siteSummaryInstructions,
      userPrompt: combinedMarkdown,
    })
    debug('Summary generated: %o', summary)

    // Save the summary in the cache
    await this.setSummary(urls, summary)

    return summary
  }

  private getSummary(urls: string[]) {
    return this.kvstore.get<SummaryResponseType>(this.summaryKey(urls))
  }

  private setSummary(urls: string[], summary: SummaryResponseType) {
    return this.kvstore.set(this.summaryKey(urls), summary)
  }

  private summaryKey(urls: string[]) {
    const hash = crypto.createHash('md5').update(urls.join(',')).digest('hex')

    return `llmsummary:${hash}`
  }
}
