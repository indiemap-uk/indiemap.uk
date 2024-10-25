import {camelCase, mapKeys} from 'es-toolkit'

/** Change all keys in an object to camel case */
export const objToCamel = <T>(obj: object): T => {
	return mapKeys(obj, (_, key) => camelCase(key)) as T
}
