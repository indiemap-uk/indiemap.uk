import Keyv from 'keyv'
import {KeyvFile} from 'keyv-file'

import type {KVStore} from './KVStore.js'

/**
 * A Key Vaulue store service that uses the file system
 */
export class KVFileStore implements KVStore {
	#keyv: Keyv

	constructor() {
		this.#keyv = new Keyv({
			store: new KeyvFile(),
		})
	}

	public get(key: string) {
		return this.#keyv.get(key)
	}

	public set(key: string, value: string) {
		return this.#keyv.set(key, value)
	}
}
