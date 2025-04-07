import {createKeyv} from '@keyv/sqlite'
import Keyv from 'keyv'

import type {KVStore} from './KVStore.js'

/**
 * A Key Vaulue store service that uses the file system
 */
export class KVSQLiteStore implements KVStore {
	#keyv: Keyv

	constructor(dbPath = 'summarizer.sqlite') {
		this.#keyv = createKeyv(`sqlite://${dbPath}`)
	}

	public get(key: string) {
		return this.#keyv.get(key)
	}

	public set(key: string, value: string) {
		return this.#keyv.set(key, value)
	}
}
