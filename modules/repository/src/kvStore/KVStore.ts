/**
 * A Key Vaulue store service
 */
export interface KVStore {
	get: <T = any>(key: string) => Promise<T | undefined>
	set: <T = any>(key: string, value: T) => Promise<boolean>
}
