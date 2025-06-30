import {type TypeID, fromString} from 'typeid-js'
import * as v from 'valibot'

/**
 * Create a Valibot schema for a TypeID with a given prefix
 *
 * Example:
 *
 * ```ts
 * const PigIdSchema = TypeIDSchema('pig')
 * const somePigId = v.parse(PigIdSchema, 'pig_00041061050r3gg28a1c60t3gf')
 *
 * // somePigId is a TypeID<'pig'> so can be passed to getPig
 * const getPig = (id: TypeID<'pig'>) => {...}
 * ```
 *
 * @param prefix the prefix of the TypeID
 * @returns A Valibot schema for TypeId<prefix>
 */
export const TypeIDSchema = <T extends string>(prefix: T) =>
  v.custom<TypeID<T>>(
    (value: unknown) => {
      if (typeof value !== 'string') return false

      try {
        fromString(value, prefix)
        return true
      } catch {
        return false
      }
    },
    (issue) =>
      `${issue.received} is not a valid "${prefix}" TypeID. Valid example: "${prefix}_00041061050r3gg28a1c60t3gf"`,
  )
