import * as v from 'valibot'

import {NameSearchSchema} from '../NameSearchSchema.js'
import {TimestampSchema} from '../TimestampSchemas.js'
import {TownIDSearchSchema, TownSchema} from '../town/index.js'
import {BusinessIdSchema} from './BusinessId.js'

const townStatus = v.picklist(['live', 'draft'])

/**
 * A schema representing a Business, this includes references to other entities.
 **/
export const BusinessSchema = v.object({
	description: v.nullish(v.pipe(v.string(), v.trim(), v.minLength(5), v.maxLength(1000))),
	id: BusinessIdSchema,
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(2, 'At least two characters'),
		v.maxLength(100, 'At most 100 characters'),
	),
	/** The status of the business, live by default. Not available to users when draft. */
	status: v.optional(townStatus),
	townId: v.nullable(TownSchema.entries.id),
	...TimestampSchema.entries,
})

export const BusinessResolvedSchema = v.object({
	...BusinessSchema.entries,
	town: v.nullish(TownSchema),
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

/**
 * User schema for creating an entity
 */
export const BusinessUserCreateSchema = v.omit(BusinessSchema, ['id', 'createdAt', 'updatedAt'])

/**
 * Schema for creating an entity via the repository (requires dates set by the service)
 */
export const BusinessCreateSchema = v.omit(BusinessSchema, ['id'])

/**
 * Business search schema
 * Either {name and town ID} or {name and town name}.
 */
export const BusinessSearchSchema = v.object({
	/** Business name starts with */
	name: v.nullish(NameSearchSchema),
	/** The status to filter on */
	status: v.nullish(townStatus),
	/** Town ID */
	townId: v.nullish(TownIDSearchSchema),
})

/**
 * Options to influence the list of businesses.
 * Use `order.by` keys matching the core schema (camelCase, not snake_case)
 */
export const BusinessListArgsSchema = v.object({
	limit: v.optional(v.number(), 10),
	offset: v.optional(v.number(), 0),
	order: v.optional(
		v.object({
			by: v.optional(v.pipe(v.string(), v.keyof(BusinessSchema))),
			direction: v.optional(v.picklist(['ASC', 'DESC'])),
		}),
		{by: 'id', direction: 'ASC'},
	),
})
