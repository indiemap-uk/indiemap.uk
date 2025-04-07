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
	/**
	 * The Jina AI API key. Get if from https://jina.ai/api-dashboard/key-manager
	 */
	JINA_API_KEY: v.string(),
	/**
	 * The OpenAI API key. Get if from https://platform.openai.com/settings/organization/api-keys
	 */
	OPENAI_API_KEY: v.string(),
})

export type ContainerEnvType = v.InferOutput<typeof ContainerEnvSchema>
