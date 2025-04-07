import Debug from 'debug'

import type { KVStore } from './services/KVStore.js'
import type { MarkdownService } from './services/MarkdownService.js'

import { siteSummaryInstructions } from './llm/propmpts.js'
import { summarizeBusiness } from './llm/summarizeBusiness.js'

const debug = Debug('indie:summarizer:urls')

/**
 * Given a list of URLs, generates a summary of a business by fetching all URLs
 * and passing them to an LLM.
 *
 * The 1st URL is special: the whole HTML will be processed including all metadata.
 *  Only the main content of the other URLs are process, everything else is ignored.
 */
export const summarizeUrls = async ({
	kvstore,
	markdownService,
	openAiApiKey,
	urls,
}: {
	kvstore: KVStore
	markdownService: MarkdownService
	openAiApiKey: string
	urls: string[]
}) => {
	debug('Starting summarization for %d URLs', urls.length)
	
	if (!urls.length) {
		throw new Error('No URLs provided. Pass it as $program url1,url2,url3')
	}

	if (!process.env.OPENAI_API_KEY) {
		throw new Error('No OPENAI_API_KEY provided')
	}

	debug('Fetching markdown for URLs: %o', urls)
	const markdowns = await Promise.all(
		urls.map(async (url) => {
			const cached = await kvstore.get(`md:${url}`)
			if (cached) {
				debug('Using cached markdown for %s', url)
				return cached
			}

			debug('Fetching markdown for %s', url)
			const markdown = await markdownService.get(url)
			await kvstore.set(`md:${url}`, markdown)

			return markdown
		}),
	)

	const combinedMarkdown = markdowns.join('\n\n---\n\n')
	debug('Combined markdown length: %d characters', combinedMarkdown.length)

	debug('Calling LLM to summarize business')
	const summary = await summarizeBusiness({
		apiKey: openAiApiKey,
		kvstore,
		model: 'gpt-4',
		systemPrompt: siteSummaryInstructions,
		userPrompt: combinedMarkdown,
	})
	debug('Summary generated: %o', summary)

	const runId =
		new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-').replaceAll('-', '') +
		Math.random().toString(36).substring(2, 15)

	kvstore.set(`${runId}:01 urls`, urls.join(','))
	kvstore.set(`${runId}:02 llm:systemPrompt`, siteSummaryInstructions)
	kvstore.set(`${runId}:03 llm:userPrompt`, combinedMarkdown)
	kvstore.set(`${runId}:04 llm:summary`, JSON.stringify(summary, null, 4))

	return summary
}
