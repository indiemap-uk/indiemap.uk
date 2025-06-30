import {describe, expect, test} from 'vitest'

import {objToSnake} from './objToSnake.js'

describe('Obj to Snake', () => {
  test('converts object keys to snake case', () => {
    expect(objToSnake({abcEfg: 1})).toEqual({abc_efg: 1})
  })
})
