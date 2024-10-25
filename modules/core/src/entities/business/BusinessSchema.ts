import * as v from 'valibot'
import {LinkSchema} from '../link/index.js'
import {TownSchema} from '../town/index.js'

export const BusinessSchema = v.object({
	id: v.string(),
	name: v.string(),
	description: v.optional(v.string()),
	townId: TownSchema.entries.id,
	links: v.array(LinkSchema),
})

export const BusinessCreateSchema = v.omit(BusinessSchema, ['id', 'links'])

export const BusinessUpdateSchema = v.partial(BusinessCreateSchema)
