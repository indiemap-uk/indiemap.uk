import {signOut} from '$lib/authn/authjs'
import {redirect} from '@sveltejs/kit'
import ky from 'ky'

import type {PageServerLoad} from '../$types'
import type {Actions} from './$types'

export const load: PageServerLoad = async ({locals, request}) => {}

export const actions: Actions = {
	default: async (event) => {
		const session = await event.locals.auth()
		if (!session) {
			redirect(303, '/')
		}

		/**
		 * Kill the github session grant on logout.
		 * Otherwise the user would get a new access token from GitHub automatically the next time they clicked login.
		 * https://docs.github.com/en/rest/apps/oauth-applications?apiVersion=2022-11-28
		 * Not a clear security risk but feels like a cleaer user experience, plus this allows switching to a different GitHub account.
		 */
		if (session.user.provider === 'github') {
			await ky
				.delete(`https://api.github.com/applications/${event.locals.env.AUTH_GITHUB_ID}/grant`, {
					headers: {
						Accept: 'application/vnd.github+json',
						Authorization: `Basic ${btoa(`${event.locals.env.AUTH_GITHUB_ID}:${event.locals.env.AUTH_GITHUB_SECRET}`)}`,
						'X-GitHub-Api-Version': '2022-11-28',
					},
					json: {
						access_token: session.user.accessToken,
					},
				})
				.catch((error) => {
					console.error('error in github grant delete', error)
				})
		}

		await signOut(event)
	},
}
