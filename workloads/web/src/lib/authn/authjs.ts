import {type DefaultSession, SvelteKitAuth} from '@auth/sveltekit'
import GitHub from '@auth/sveltekit/providers/github'

declare module '@auth/sveltekit' {
	interface Session {
		user: {
			accessToken: string
			id: string
			provider: string
			/**
			 * By default, TypeScript merges new interface properties and overwrites existing ones.
			 * In this case, the default session user properties will be overwritten,
			 * with the new ones defined above. To keep the default session user properties,
			 * you need to add them back into the newly declared interface.
			 */
		} & DefaultSession['user']
	}
}

/**
 * Using the authjs callback we update the user.id to include the provider, for example:
 * 'github-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
 *
 * This allows setting the list of admin users in the environment variables!
 */
export const {handle, signIn, signOut} = SvelteKitAuth({
	callbacks: {
		/**
		 * account example (github):
		 *
		 * {
		 *   access_token: 'gho_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		 *   token_type: 'bearer',
		 *   scope: 'read:user,user:email',
		 *   provider: 'github',
		 *   type: 'oauth',
		 *   providerAccountId: '1111111'
		 * }
		 *
		 * profile: a large, provider specific object
		 *
		 * token example (github):
		 *
		 * {
		 *   name: 'aaaaa aaaa',
		 *   email: 'aaa@aaaaaa.aaa',
		 *   picture: 'https://avatars.githubusercontent.com/u/1111111?v=4',
		 *   sub: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
		 * }
		 *
		 * user example (github):
		 * {
		 *   id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // same as token.sub
		 *   name: 'aaaaa aaaa',
		 *   email: 'aaa@aaaaaa.aaa',
		 *   image: 'https://avatars.githubusercontent.com/u/1111111?v=4',
		 * }
		 *
		 */
		jwt({account, token, user}) {
			if (user) {
				// User.id example: `github-123123123`
				token.id = `${account?.provider}-${account?.providerAccountId}`
				token.accessToken = account?.access_token
				token.provider = account?.provider
			}
			return token
		},
		/**
		 * token example (github):
		 *
		 * {
		 * 	name: 'Some One',
		 * 	email: 'email@example.com',
		 * 	picture: 'https://avatars.example.com/u/1234567',
		 * 	sub: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		 * 	id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
		 * 	iat: 1231231232,
		 * 	exp: 1231231232,
		 * 	jti: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
		 * }
		 */
		session({session, token}) {
			session.user.id = token.id as string
			session.user.provider = token.provider as string
			session.user.accessToken = token.accessToken as string
			return session
		},
	},

	providers: [GitHub],
})
