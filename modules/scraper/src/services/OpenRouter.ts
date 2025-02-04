import type {SqlError} from '@effect/sql'

import {Console, Context, Effect, Schema} from 'effect'

const ChatSchema = Schema.Struct({
	messages: Schema.Array(
		Schema.Struct({
			content: Schema.String,
			role: Schema.String,
		}),
	),
	model: Schema.String,
})

const AnswerSchema = Schema.Struct({
	links: Schema.Array(Schema.String).pipe(Schema.optional),
	longDescription: Schema.String.pipe(Schema.optional),
	madeInUk: Schema.String.pipe(Schema.optional),
	meta: Schema.String.pipe(Schema.optional),
	products: Schema.Array(Schema.String).pipe(Schema.optional),
	shortDescription: Schema.String,
	title: Schema.String,
})

interface ChatArgs {
	apiKey: string
	model: string
	systemPrompt: string
	userPrompt: string
}

export class OpenRouterError {
	readonly _tag = 'OpenRouterError'
	constructor(
		readonly cause: unknown,
		readonly message: string,
	) {}
}

export class OpenRouterService extends Context.Tag('OpenRouterService')<
	OpenRouterService,
	{
		readonly chat: (args: ChatArgs) => Effect.Effect<string, OpenRouterError | SqlError.SqlError>
	}
>() {}

export const OpenRouter = Effect.gen(function* () {
	return {
		chat: ({apiKey, model, systemPrompt, userPrompt}: ChatArgs) =>
			Effect.gen(function* () {
				if (!apiKey) {
					yield* Effect.fail(new OpenRouterError(null, 'No API key provided'))
				}

				yield* Console.log(`Using model ${model}`)

				const payload = Schema.encodeSync(ChatSchema)({
					messages: [
						{
							content: systemPrompt,
							role: 'system',
						},
						{
							content: userPrompt,
							role: 'user',
						},
					],
					model,
				})

				const response = yield* Effect.tryPromise({
					catch: (error) => new OpenRouterError(error, 'Failed to fetch OpenRouter API'),
					try: () =>
						fetch('https://openrouter.ai/api/v1/chat/completions', {
							body: JSON.stringify(payload),
							headers: {
								Authorization: `Bearer ${apiKey}`,
								'Content-Type': 'application/json',
							},
							method: 'POST',
						}),
				})

				if (!response.ok) {
					throw new OpenRouterError(response, 'OpenRouter API returned an error')
				}

				const parsed = yield* Effect.tryPromise({
					catch: (error) => new OpenRouterError(error, 'Failed to parse OpenRouter API response'),
					try: () => response.json(),
				})

				let answer = parsed.choices?.[0]?.message?.content
				yield* Console.log('answer in OpenRouter.ts', answer)
				answer = Schema.decodeSync(AnswerSchema)(JSON.parse(answer))

				return answer
			}),
	}
})
