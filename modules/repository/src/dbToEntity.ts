import type {BaseIssue, BaseSchema, InferOutput} from 'valibot'

import Debug from 'debug'
import {mapValues} from 'es-toolkit'
import * as v from 'valibot'

import {objToCamel} from './objToCamel.js'

const debug = Debug('indie:repo:dbToEntity')

export const dbToEntity = <S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
	record: object,
	schema: S,
): InferOutput<S> => {
	debug('record %j', record)

	const camel = objToCamel(record)
	const dated = mapValues(camel as object, (value: unknown) => {
		// timestamptz: 2024-12-02T18:43:07.609+00:00
		// timestamptz from  Zapatos: 2024-12-04T22:28:30+00:00
		if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
			return new Date(value)
		}

		return value
	})

	const result = v.safeParse(schema, dated)

	if (result.success) {
		return result.output
	}

	const msg = result.issues
		.map((issue) => `${issue?.path?.[0].key}: expected ${issue.expected}, got ${issue.received}`)
		.join('; ')

	throw new Error(`dbToEntity failed: ${msg}`)
}
