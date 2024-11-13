import * as staticPrivateEnv from '$env/static/private'
import {handle as authjsHandle} from '$lib/authn/authjs.js'
import {ContainerEnvSchema} from '$lib/server/container/ContainerEnvSchema'
import {getContainer} from '$lib/server/container/getContainer'
/* @typescript-eslint/unbound-method errors for `resolve` argument, but that is completely valid */
/* eslint-disable @typescript-eslint/unbound-method */
import {type Handle} from '@sveltejs/kit'
import {sequence} from '@sveltejs/kit/hooks'
import {redirect} from 'sveltekit-flash-message/server'
import * as v from 'valibot'

/** Protects the admin routes **/
const protectAdmin: Handle = async ({event, resolve}) => {
	const env = v.parse(ContainerEnvSchema, staticPrivateEnv)
	const session = await event.locals.auth()
	const isAdminUser = session && env.ADMIN_USER_IDS.split(',').includes(session?.user.id)
	const isNotAdminUser = session && !isAdminUser
	const isAdminRoute = event.url.pathname.startsWith('/admin')
	const isLoginPage = event.url.pathname === '/login'

	if (isAdminRoute && isNotAdminUser) {
		redirect('/', {message: 'You are not an admin user', type: 'error'}, event)
	}

	if (isAdminRoute && !isAdminUser) {
		redirect(303, '/login')
	}

	if (isLoginPage && isAdminUser) {
		redirect(303, '/admin')
	}

	return resolve(event)
}

/** Add the container to the locals **/
const handleContainer: Handle = async ({event, resolve}) => {
	const env = v.parse(ContainerEnvSchema, staticPrivateEnv)
	const container = getContainer(env)
	event.locals.container = container

	return resolve(event)
}

export const handle = sequence(authjsHandle, protectAdmin, handleContainer)
