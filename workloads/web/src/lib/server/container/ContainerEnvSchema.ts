import * as v from 'valibot'

export const ContainerEnvSchema = v.object({
	DATABASE_URL: v.string(),
})

export type ContainerEnvType = v.InferOutput<typeof ContainerEnvSchema>
