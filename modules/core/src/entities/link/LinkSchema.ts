import * as v from 'valibot'

import {newIdFn} from '../../id/newIdFn.js'
import {TypeIDSchema} from '../../id/TypeIDSchema.js'
import {BusinessIdSchema} from '../business/BusinessId.js'

const listIdPrefix = 'link'
const LinkIdSchema = TypeIDSchema(listIdPrefix)
export const newLinkId = newIdFn(listIdPrefix)

export const LinkSchema = v.object({
	businessId: BusinessIdSchema,
	id: LinkIdSchema,
	label: v.optional(v.string()),
	url: v.pipe(v.string(), v.url()),
})

export const LinkCreateSchema = v.omit(LinkSchema, ['id'])

export const LinkUpdateSchema = v.partial(LinkCreateSchema)
