import {FetchHttpClient} from '@effect/platform'
import {NodeRuntime} from '@effect/platform-node'
import {Console, Effect, Layer} from 'effect'

import {siteSummaryInstructions} from './llm/propmpts.js'
import {GetHtml, GetHtmlService} from './services/GetHtml.js'
import {HtmlToMd} from './services/HtmlToMd.js'
import {KVStore, KVStoreService} from './services/KVStore.js'
import {OpenRouter, OpenRouterService} from './services/OpenRouter.js'

/**
An example run:

tsx src/main.ts url1,url2,url3

The 1st URL is special: the whole HTML will be processed including all metadata.
Only the main content of the other URLs are process, everything else is ignored.
*/

const urls = process.argv[2]?.split(',')

if (!urls?.length) {
	throw new Error('No URLs provided. Pass it as $program url1,url2,url3')
}

if (!process.env.OPENROUTER_API_KEY) {
	throw new Error('No OPENROUTER_API_KEY provided')
}

const program = Effect.gen(function* () {
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
		apiKey: process.env.OPENROUTER_API_KEY as string,
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
})

const KVLive = Layer.effect(KVStoreService, KVStore)

const GetHtmlLive = Layer.effect(GetHtmlService, GetHtml).pipe(
	Layer.provide(KVLive),
	Layer.provide(FetchHttpClient.layer),
)

const OpenRouterLive = Layer.effect(OpenRouterService, OpenRouter).pipe(Layer.provide(KVLive))

const main = Effect.provide(program, GetHtmlLive).pipe(
	Effect.provide(KVLive),
	Effect.provide(OpenRouterLive),
	Effect.scoped,
	Effect.catchTags({
		GetHtmlError: (error) => Console.error('GetHtmlError:', error),
		OpenRouterError: (error) => Console.error('OpenRouterError:', error),
		RequestError: (error) => Console.error('RequestError:', error),
		ResponseError: (error) => Console.error('ResponseError:', error),
		SqlError: (error) => Console.error('SqlError:', error),
	}),
)

NodeRuntime.runMain(main)
