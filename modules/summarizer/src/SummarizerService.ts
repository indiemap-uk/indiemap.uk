import crypto from 'crypto'
import Debug from 'debug'

import type {KVStore} from './services/KVStore.js'
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
	 *
	 * The 1st URL is special: the whole HTML will be processed including all metadata.
	 * Only the main content of the other URLs are process, everything else is ignored.
	 */
	public async summarizeUrls(urls: string[]) {
		debug('Starting summarization for %d URLs', urls.length)

		if (!urls.length) {
			throw new Error('No URLs provided. Pass it as $program url1,url2,url3')
		}

		const urlsHash = crypto.createHash('md5').update(urls.join(',')).digest('hex')
		const cachedSummary = await this.kvstore.get(`summary:${urlsHash}`)
		if (cachedSummary) {
			debug('Using cached summary for %s', urlsHash)
			return JSON.parse(cachedSummary)
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
			kvstore: this.kvstore,
			model: 'gpt-4',
			systemPrompt: siteSummaryInstructions,
			userPrompt: combinedMarkdown,
		})
		debug('Summary generated: %o', summary)

		// Save the summary in the cache
		await this.kvstore.set(`summary:${urlsHash}`, JSON.stringify(summary))

		const runId =
			new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-').replaceAll('-', '') +
			Math.random().toString(36).substring(2, 15)

		this.kvstore.set(`${runId}:01 urls`, urls.join(','))
		this.kvstore.set(`${runId}:02 llm:systemPrompt`, siteSummaryInstructions)
		this.kvstore.set(`${runId}:03 llm:userPrompt`, combinedMarkdown)
		this.kvstore.set(`${runId}:04 llm:summary`, JSON.stringify(summary, null, 4))

		return summary
	}
}
