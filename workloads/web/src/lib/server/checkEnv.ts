import * as v from 'valibot'

import {ServerEnvSchema} from './ServerEnvSchema'

/**
 * Checks environment variables against the schema.
 * Throw if the config is not valid, returnes the config otherwise.
 */
export const checkEnv = (env: unknown) => {
	const envCheck = v.safeParse(ServerEnvSchema, env)

	if (!envCheck.success) {
		const issues = envCheck.issues.map((issue) => `${issue.path?.[0].key as string}: ${issue.message}`).join('\n')

		throw new Error(`Indiemap/checkEnv: The environment is invalid!: \n${issues}`)
	}

	return envCheck.output
}
