/* @typescript-eslint/unbound-method errors for `resolve` argument, but that is completely valid */
/* eslint-disable @typescript-eslint/unbound-method */
import type {Handle} from '@sveltejs/kit'

import * as staticPrivateEnv from '$env/static/private'
import {ContainerEnvSchema} from '$lib/server/container/ContainerEnvSchema'
import {getContainer} from '$lib/server/container/getContainer'
import * as v from 'valibot'

export const handle: Handle = async ({event, resolve}) => {
	const env = v.parse(ContainerEnvSchema, staticPrivateEnv)
	const container = getContainer(env)
	event.locals.container = container

	return resolve(event)
}
