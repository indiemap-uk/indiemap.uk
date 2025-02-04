import {FetchHttpClient} from '@effect/platform'
import {NodeRuntime} from '@effect/platform-node'
import {Console, Effect, Layer} from 'effect'

import {GetHtml, GetHtmlService} from './services/GetHtml.js'
import {KVStore, KVStoreService} from './services/KVStore.js'
import {OpenRouter, OpenRouterService} from './services/OpenRouter.js'
import {program} from './program.js'

/**
The entry point for using the scraper as a library
*/

export const scraper = ({urls, openRouterKey}: {openRouterKey: string; urls: string[]}) => {
	const KVLive = Layer.effect(KVStoreService, KVStore)

	const GetHtmlLive = Layer.effect(GetHtmlService, GetHtml).pipe(
		Layer.provide(KVLive),
		Layer.provide(FetchHttpClient.layer),
	)

	const OpenRouterLive = Layer.effect(OpenRouterService, OpenRouter).pipe(Layer.provide(KVLive))

	const main = Effect.provide(program({urls, openRouterKey}), GetHtmlLive).pipe(
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

	return Effect.runPromise(main)
}
