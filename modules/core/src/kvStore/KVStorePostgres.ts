import {createKeyv} from '@keyv/postgres'
import Keyv from 'keyv'

import type {KVStore} from './KVStore.js'

export class KVStorePostgres implements KVStore {
  #keyv: Keyv

  constructor({schema, table, uri}: {schema: string; table: string; uri: string}) {
    this.#keyv = createKeyv({
      schema,
      // Note: you don't need to create the table beforehand, keyv will handle it
      table,
      uri,
    })
  }

  /** Use .init to force-creating the database table */
  async init() {
    await this.#keyv.set('init', 'init')
    await this.#keyv.delete('init')
  }

  public get<T = any>(key: string) {
    return this.#keyv.get<T>(key)
  }

  public set<T = any>(key: string, value: T) {
    return this.#keyv.set<T>(key, value)
  }
}
