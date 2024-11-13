import * as v from 'valibot'

export const ContainerEnvSchema = v.object({
	ADMIN_USER_IDS: v.string('Missing ADMIN_USER_IDS'),
	DATABASE_URL: v.string('Missing DATABASE_URL'),
	GEOCODIFY_API_KEY: v.string('Must be a comma separated list, e.g. "github-123123123,github-98798797"'),
})

export type ContainerEnvType = v.InferOutput<typeof ContainerEnvSchema>
