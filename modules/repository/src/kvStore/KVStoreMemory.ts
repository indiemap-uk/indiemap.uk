import Keyv from 'keyv'
import type {KVStore} from './KVStore.js'

/**
 * A memory-based Key Value store implementation using keyv
 */
export class KVStoreMemory implements KVStore {
  readonly #keyv: Keyv

  constructor() {
    this.#keyv = new Keyv()
  }

  public async get<T = any>(key: string): Promise<T | undefined> {
    return this.#keyv.get(key)
  }

  public async set<T = any>(key: string, value: T): Promise<boolean> {
    return this.#keyv.set(key, value)
  }
}
