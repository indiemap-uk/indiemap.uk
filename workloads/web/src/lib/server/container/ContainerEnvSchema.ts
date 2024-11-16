import * as v from 'valibot'

export const ContainerEnvSchema = v.object({
	/**
	 * The full DB URL, e.g. postgres://indie:indie@localhost:5431/indie?sslmode=disable
	 */
	DATABASE_URL: v.string(),
	/**
	 * The Geocodify API key. Get if from https://geocodify.com/account/dashboard
	 */
	GEOCODIFY_API_KEY: v.string(),
})

export type ContainerEnvType = v.InferOutput<typeof ContainerEnvSchema>
