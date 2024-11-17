import * as v from 'valibot'

export const AuthEnvSchema = v.object({
	/**
	 * Comma separated list of emails that are admin users
	 * See $lib/authn/authjs.ts and hooks.server.ts
	 **/
	ADMIN_USER_EMAILS: v.string(),
	/**
	 * The Resend.com API key, used for email magic links.
	 * https://resend.com/api-keys
	 */
	AUTH_RESEND_KEY: v.string(),
	/**
	 * The secret used to sign the JWT tokens by Auth.js.
	 * 32+ characters. See https://authjs.dev/reference/sveltekit#usage
	 */
	AUTH_SECRET: v.string(),
})
