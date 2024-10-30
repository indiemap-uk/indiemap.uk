import * as v from 'valibot'

import {LinkSchema} from '../link/index.js'
import {TownSchema} from '../town/index.js'

export const BusinessSchema = v.object({
	description: v.optional(v.pipe(v.string(), v.minLength(5), v.maxLength(500))),
	id: v.string(),
	links: v.array(LinkSchema),
	name: v.pipe(v.string(), v.minLength(2, 'At least two characters'), v.maxLength(100, 'At most 100 characters')),
	townId: TownSchema.entries.id,
})

export const BusinessCreateSchema = v.omit(BusinessSchema, ['id', 'links'])

export const BusinessUpdateSchema = v.partial(BusinessCreateSchema)
