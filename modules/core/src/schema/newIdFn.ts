import {nanoid} from 'nanoid'

export const newIdFn = (prefix: string) => () => `${prefix}_${nanoid()}`
