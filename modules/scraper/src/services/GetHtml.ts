import {HttpClient} from '@effect/platform'
import type {HttpClientError} from '@effect/platform/HttpClientError'
import {Context, Effect} from 'effect'
import {KVStoreService} from './KVStore.js'

export class GetHtmlError {
	readonly _tag = 'GetHtmlError'
	constructor(
		readonly cause: unknown,
		readonly message: string,
	) {}
}

/**
 * Service to fetch the HTML of a given URL.
 * Returns the cached value if available.
 */
export class GetHtmlService extends Context.Tag('GetHtmlService')<
	GetHtmlService,
	{
		readonly get: (url: string) => Effect.Effect<string, GetHtmlError | HttpClientError>
	}
>() {}

// Function that creates the service, i.e. a constructor -- the service is
// in the `return` statement :) #learningeffect
export const GetHtml = Effect.gen(function* () {
	const kv = yield* KVStoreService
	const httpClient = yield* HttpClient.HttpClient

	return {
		get: (url: string) =>
			Effect.gen(function* () {
				const cached = yield* kv.get(url)
				if (cached) {
					return cached
				}

				const res = yield* httpClient.get(url)
				if (res.status > 200) {
					yield* Effect.fail(new GetHtmlError(res.status, `Error fetching ${url}`))
				}

				const html = yield* res.text

				yield* kv.set(url, html)

				return html
			}).pipe(
				Effect.scoped,
				Effect.catchTag(
					'SqlError',
					Effect.mapError((e) => new GetHtmlError(e, e.message)),
				),
			),
	}
})
