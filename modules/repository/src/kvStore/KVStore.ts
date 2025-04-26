/**
 * A Key Vaulue store service
 */
export interface KVStore {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get: <T = any>(key: string) => Promise<T | undefined>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	set: <T = any>(key: string, value: T) => Promise<boolean>
}
