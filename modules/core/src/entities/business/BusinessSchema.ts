import * as v from 'valibot'

import {TownSchema} from '../town/index.js'
import {BusinessIdSchema} from './BusinessId.js'

const BusinessResolvedReferences = v.object({
	town: TownSchema,
})

/**
 * A schema representing a Business, this includes references to other entities.
 **/
export const BusinessSchema = v.object({
	description: v.nullish(v.pipe(v.string(), v.trim(), v.minLength(5), v.maxLength(500))),
	id: BusinessIdSchema,
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(2, 'At least two characters'),
		v.maxLength(100, 'At most 100 characters'),
	),
	townId: TownSchema.entries.id,
})

export const BusinessResolvedSchema = v.object({
	...BusinessSchema.entries,
	...BusinessResolvedReferences.entries,
})

/**
 * Schema for CRUD operations for a controller.
 *
 * When the ID is missing it can be used as a create schema,
 * otherwise as an update.
 */
export const BusinessCRUDSchema = v.object({
	...BusinessSchema.entries,
	id: v.nullish(BusinessSchema.entries.id),
})

/** Schema for creating an entity */
export const BusinessCreateSchema = v.omit(BusinessSchema, ['id'])
