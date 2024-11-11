import * as v from 'valibot'

export const ContainerEnvSchema = v.object({
	DATABASE_URL: v.string('Missing DATABASE_URL'),
	GEOCODIFY_API_KEY: v.string('Missing Geocodify.com API key'),
})

export type ContainerEnvType = v.InferOutput<typeof ContainerEnvSchema>
