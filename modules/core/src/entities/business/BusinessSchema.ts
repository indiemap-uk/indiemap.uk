import * as v from 'valibot'

import {TownSchema} from '../town/index.js'
import {BusinessIdSchema} from './BusinessId.js'

/**
 * A schema representing a Business.
 *
 * Other properties might be added by services, e.g. a list of LInks or the Town the business is in,
 * but these are treted as separate entities and we only store the mandatory relations in the core entity.
 **/
export const BusinessSchema = v.object({
	description: v.nullish(v.pipe(v.string(), v.minLength(5), v.maxLength(500))),
	id: BusinessIdSchema,
	name: v.pipe(v.string(), v.minLength(2, 'At least two characters'), v.maxLength(100, 'At most 100 characters')),
	townId: TownSchema.entries.id,
})

/** Schema for creating an entity */
export const BusinessCreateSchema = v.omit(BusinessSchema, ['id'])

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
