import {mapKeys, snakeCase} from 'es-toolkit'

/** Change all keys in an object to snake case */
export const objToSnake = <T>(obj: object): T => {
	return mapKeys(obj, (_, key) => snakeCase(key)) as T
}
