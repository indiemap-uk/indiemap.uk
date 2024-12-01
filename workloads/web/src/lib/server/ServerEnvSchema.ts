import {AuthEnvSchema} from '$lib/authN/AuthEnvSchema'
import * as v from 'valibot'

import {ContainerEnvSchema} from './container/ContainerEnvSchema'

export const ServerEnvSchema = v.object({
	...AuthEnvSchema.entries,
	...ContainerEnvSchema.entries,
})

export type ServerEnvType = v.InferOutput<typeof ServerEnvSchema>
