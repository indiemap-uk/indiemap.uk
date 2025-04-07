import * as v from 'valibot'

/** Schema to search a business by name */
export const NameSearchSchema = v.pipe(v.string(), v.trim(), v.minLength(3), v.maxLength(20))
