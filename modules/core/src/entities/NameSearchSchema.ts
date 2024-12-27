import * as v from 'valibot'

export const NameSearchSchema = v.pipe(v.string(), v.trim(), v.minLength(3), v.maxLength(20))
