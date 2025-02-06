import {Console, Effect} from 'effect'

import {siteSummaryInstructions} from './llm/propmpts.js'
import {GetHtmlService} from './services/GetHtml.js'
import {HtmlToMd} from './services/HtmlToMd.js'
import {KVStoreService} from './services/KVStore.js'
import {OpenRouterService} from './services/OpenRouter.js'

export const program = ({openRouterKey, urls}: {openRouterKey: string; urls: string[]}) =>
	Effect.gen(function* () {
		const runId =
			new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-').replaceAll('-', '') +
			'-' +
			Math.random().toString(36).substring(2, 15)
		const getHtml = yield* GetHtmlService
		const openRouter = yield* OpenRouterService
		const kv = yield* KVStoreService

		yield* Console.log('Run id:', runId)
		yield* Console.log('URLs: ', urls)

		const markdowns = yield* Effect.all(
			urls.map((url, i) =>
				Effect.gen(function* () {
					const html = yield* getHtml.get(url)
					return yield* HtmlToMd(html, {
						extractMainContent: i !== 0,
						includeMetaData: i === 0 ? 'extended' : false,
						websiteDomain: new URL(url).hostname,
					})
				}),
			),
		)

		const combinedMarkdown = markdowns.join('\n\n---\n\n')
		const model = 'meta-llama/llama-3.3-70b-instruct'
		const llmResponse = yield* openRouter.chat({
			apiKey: openRouterKey,
			model,
			systemPrompt: siteSummaryInstructions,
			userPrompt: combinedMarkdown,
		})

		yield* kv.set(`${runId}:urls`, urls.join(','))
		yield* kv.set(`${runId}:llm:model`, model)
		yield* kv.set(`${runId}:llm:systemPrompt`, siteSummaryInstructions)
		yield* kv.set(`${runId}:llm:userPrompt`, combinedMarkdown)
		yield* kv.set(`${runId}:llm:response`, JSON.stringify(llmResponse, null, 4))

		yield* Console.log(llmResponse)

		return llmResponse
	})
