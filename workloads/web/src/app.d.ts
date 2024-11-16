// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type {ServerEnvType} from '$lib/server/ServerEnvSchema'

import {AppContainer} from '$lib/server/container/AppContainer'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			container: AppContainer
			env: ServerEnvType
		}
		interface PageData {
			flash?: {message: string; type: 'error' | 'success'}
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
