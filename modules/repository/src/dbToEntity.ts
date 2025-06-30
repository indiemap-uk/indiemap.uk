import type {BaseIssue, BaseSchema, InferOutput} from 'valibot'

import Debug from 'debug'
import * as v from 'valibot'

import {objToCamel} from './objToCamel.js'

const debug = Debug('indie:repo:dbToEntity')

export const dbToEntity = <S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  record: object,
  schema: S,
): InferOutput<S> => {
  debug('record %j', record)

  const result = v.safeParse(schema, objToCamel(record))

  if (result.success) {
    return result.output
  }

  const msg = result.issues
    .map((issue) => `${issue?.path?.[0].key}: expected ${issue.expected}, got ${issue.received}`)
    .join('; ')

  throw new Error(`dbToEntity failed: ${msg}`)
}
