import * as v from 'valibot'

import {LinkSchema} from '../link/index.js'
import {TownSchema} from '../town/index.js'

export const BusinessSchema = v.object({
	description: v.optional(v.string()),
	id: v.string(),
	links: v.array(LinkSchema),
	name: v.string(),
	townId: TownSchema.entries.id,
})

export const BusinessCreateSchema = v.omit(BusinessSchema, ['id', 'links'])

export const BusinessUpdateSchema = v.partial(BusinessCreateSchema)
