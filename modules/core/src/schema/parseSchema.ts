import * as v from 'valibot'

/**
 * Parse a schema and return the output or throws a human-readable error message.
 */
export const parseSchema = <const TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  schema: TSchema,
  data: unknown,
) => {
  const result = v.safeParse(schema, data)

  if (result.success) {
    return result.output
  } else {
    const explain = v.summarize(result.issues)
    throw new Error(`Validation failed: ${explain}`)
  }
}
