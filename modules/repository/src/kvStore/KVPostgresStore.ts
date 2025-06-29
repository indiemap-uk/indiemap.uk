import {createKeyv} from '@keyv/postgres'
import Keyv from 'keyv'

import type {KVStore} from './KVStore.js'

/**
 * A Key Vaulue store service that uses the file system
 */
export class KVPostgresStore implements KVStore {
	#keyv: Keyv

	constructor({schema, table, uri}: {schema: string; table: string; uri: string}) {
		this.#keyv = createKeyv({
			schema,
			// Note: you don't need to create the table beforehand, keyv will handle it
			table,
			uri,
		})
	}

	public get<T = any>(key: string) {
		return this.#keyv.get<T>(key)
	}

	public set<T = any>(key: string, value: T) {
		return this.#keyv.set<T>(key, value)
	}
}
