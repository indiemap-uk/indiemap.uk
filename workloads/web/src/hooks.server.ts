import * as staticPrivateEnv from '$env/static/private'
import {handle as authjsHandle} from '$lib/authn/authjs.js'
import {isAdminEmail} from '$lib/authZ/isAdminEmail'
import {checkEnv} from '$lib/server/checkEnv'
import {ContainerEnvSchema} from '$lib/server/container/ContainerEnvSchema'
import {getContainer} from '$lib/server/container/getContainer'
/* @typescript-eslint/unbound-method errors for `resolve` argument, but that is completely valid */
/* eslint-disable @typescript-eslint/unbound-method */
import {type Handle, type HandleServerError} from '@sveltejs/kit'
import {sequence} from '@sveltejs/kit/hooks'
import {redirect} from 'sveltekit-flash-message/server'
import * as v from 'valibot'

const env = checkEnv(staticPrivateEnv)
const containerEnv = v.parse(ContainerEnvSchema, staticPrivateEnv)
const container = getContainer(containerEnv)

const setEnv: Handle = ({event, resolve}) => {
	event.locals.env = env

	return resolve(event)
}

/** Protects the admin routes **/
const protectAdmin: Handle = async ({event, resolve}) => {
	// const env = v.parse(AuthEnvSchema, staticPrivateEnv)
	const session = await event.locals.auth()
	const isAdminUser = isAdminEmail(env.ADMIN_USER_EMAILS, session?.user.email)
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

/** Add the container to the locals **/
const handleContainer: Handle = async ({event, resolve}) => {
	event.locals.container = container

	return resolve(event)
}

export const handle = sequence(setEnv, authjsHandle, protectAdmin, handleContainer)

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
