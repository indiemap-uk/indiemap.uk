/**
 * A Key Vaulue store service
 */
export interface KVStore {
	get: (key: string) => Promise<string | undefined>
	set: (key: string, value: string) => Promise<boolean>
}
