import {FetchHttpClient} from '@effect/platform'
import {NodeRuntime} from '@effect/platform-node'
import {Console, Effect, Layer} from 'effect'

import {program} from './program.js'
import {GetHtml, GetHtmlService} from './services/GetHtml.js'
import {KVStore, KVStoreService} from './services/KVStore.js'
import {OpenRouter, OpenRouterService} from './services/OpenRouter.js'

/**
This is a CLI version that can be used for quick testing during develpoment.

An example run:

tsx src/cli.ts url1,url2,url3

The 1st URL is special: the whole HTML will be processed including all metadata.
Only the main content of the other URLs are process, everything else is ignored.
*/

export const urls = process.argv[2]?.split(',')

if (!urls?.length) {
	throw new Error('No URLs provided. Pass it as $program url1,url2,url3')
}

if (!process.env.OPENROUTER_API_KEY) {
	throw new Error('No OPENROUTER_API_KEY provided')
}

const KVLive = Layer.effect(KVStoreService, KVStore)

const GetHtmlLive = Layer.effect(GetHtmlService, GetHtml).pipe(
	Layer.provide(KVLive),
	Layer.provide(FetchHttpClient.layer),
)

const OpenRouterLive = Layer.effect(OpenRouterService, OpenRouter).pipe(Layer.provide(KVLive))

const main = Effect.provide(program({openRouterKey: process.env.OPENROUTER_API_KEY, urls}), GetHtmlLive).pipe(
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
