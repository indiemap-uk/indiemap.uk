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
		console.error('The env config is invalid!')
		console.error(issues)
		process.exit(1)
	}

	return envCheck.output
}
