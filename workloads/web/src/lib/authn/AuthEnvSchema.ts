import * as v from 'valibot'

export const AuthEnvSchema = v.object({
	/**
	 * Comma separated list of admin users, e.g. github-123123,github-3423432
	 * See $lib/authn/authjs.ts and hooks.server.ts
	 **/
	ADMIN_USER_IDS: v.string(),
	/**
	 * The ID of the GitHub OAuth App to use for admin authentication
	 */
	AUTH_GITHUB_ID: v.string(),
	/**
	 * The secret of the GitHub OAuth App
	 */
	AUTH_GITHUB_SECRET: v.string(),
	/**
	 * The secret used to sign the JWT tokens by Auth.js.
	 * 32+ characters. See https://authjs.dev/reference/sveltekit#usage
	 */
	AUTH_SECRET: v.string(),
})
