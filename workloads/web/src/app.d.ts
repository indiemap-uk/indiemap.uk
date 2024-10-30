// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import {AppContainer} from '$lib/server/container/AppContainer'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			container: AppContainer
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
