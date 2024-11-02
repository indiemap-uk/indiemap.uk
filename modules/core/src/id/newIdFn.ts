import {typeidUnboxed} from 'typeid-js'

export const newIdFn = (prefix: string) => () => typeidUnboxed(prefix)
