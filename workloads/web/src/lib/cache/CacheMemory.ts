import Keyv from 'keyv'

export class CacheMemory {
	#keyv: Keyv
	#ttl = 0;

	/**
	 * Creates a new Cache instance to `memo` async calls.
	 */
	constructor(ttl:  number) {
		this.#keyv = new Keyv({namespace: 'cache', ttl})
		this.#ttl = ttl;
	}

	public async memo<T>(key: string, fn: () => Promise<T>) {
		const cached = await this.#keyv.get<T>(key);

		if (cached) {
			return {
				value: cached,
				isCached: true
			};
		}

		const result = await fn();
		await this.#keyv.set<T>(key, result, this.#ttl);

		return {
			value: result,
			isCached: false
		}
	}

	public clear(): Promise<void> {
		return this.#keyv.clear();
	}
}
