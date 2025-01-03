import type {ServerEnvType} from '$lib/server/ServerEnvSchema'

import {env as dynamicPrivateEnv} from '$env/dynamic/private'
import {handle as authjsHandle} from '$lib/authN/authjs.js'
import {isAdminEmail} from '$lib/authZ/isAdminEmail'
import {checkEnv} from '$lib/server/checkEnv'
import {ContainerEnvSchema} from '$lib/server/container/ContainerEnvSchema'
import {getContainer} from '$lib/server/container/getContainer'
import {type Handle, type HandleServerError} from '@sveltejs/kit'
import {sequence} from '@sveltejs/kit/hooks'
import {redirect} from 'sveltekit-flash-message/server'
import * as v from 'valibot'

const prepareEnv: Handle = ({event, resolve}) => {
	const env = checkEnv(dynamicPrivateEnv)
	const container = getContainer(v.parse(ContainerEnvSchema, env))

	event.locals.env = env as ServerEnvType
	event.locals.container = container

	return resolve(event)
}

/** Protects the admin routes **/
const protectAdmin: Handle = async ({event, resolve}) => {
	// const env = v.parse(AuthEnvSchema, staticPrivateEnv)
	const session = await event.locals.auth()
	const isAdminUser = isAdminEmail(event.locals.env.ADMIN_USER_EMAILS, session?.user.email)
	const isLoginPage = event.url.pathname === '/admin/login'
	const isAdminRoute = event.url.pathname.startsWith('/admin') && !isLoginPage

	if (isAdminRoute && !isAdminUser) {
		redirect(303, '/admin/login')
	}

	if (isLoginPage && isAdminUser) {
		redirect(303, '/admin')
	}

	return resolve(event)
}

export const handle = sequence(prepareEnv, authjsHandle, protectAdmin)

export const handleError: HandleServerError = ({error, event, status}) => {
	console.error('UNEXPECTED ERROR', error)

	const isAdminRoute = event.url.pathname.startsWith('/admin')

	if (!isAdminRoute) {
		return {
			message: 'An error occurred',
			status,
		}
	}

	return {
		// code is available in pg's AggregateError
		message: (error as {code?: string}).code ?? 'Unknown error',
	}
}
