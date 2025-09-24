import * as v from 'valibot'

export const ContainerEnvSchema = v.object({
  /**
   * See https://axiom.co/docs/guides/pino -- optional
   */
  AXIOM_DATASET: v.optional(v.string()),
  AXIOM_TOKEN: v.optional(v.string()),
	/**
	 * The cache TTL in milliseconds, default is 1 (cache for 1 ms only)
	 */
		CACHE_TTL: v.optional(
			v.union([
				v.number(),
				v.pipe(v.string(), v.transform(Number), v.number())
			]), 1
		),
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
   * The keyv postgres schema
   */
  KEYV_SCHEMA: v.optional(v.string(), 'public'),
  /**
   * The keyv postgres table
   */
  KEYV_TABLE: v.optional(v.string(), 'keyv'),
  /**
   * The log level
   */
  LOG_LEVEL: v.optional(v.picklist(['info', 'debug', 'error']), 'info'),
  /**
   * The OpenAI API key. Get if from https://platform.openai.com/settings/organization/api-keys
   */
  OPENAI_API_KEY: v.string(),
})

export type ContainerEnvType = v.InferOutput<typeof ContainerEnvSchema>
