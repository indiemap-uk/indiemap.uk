import {describe, expect, test} from 'vitest'
import {objToCamel} from './objToCamel.js'

describe('Obj to Camel', () => {
	test('converts object keys to camel case', () => {
		expect(objToCamel({abc_efg: 1})).toEqual({abcEfg: 1})
	})
})
