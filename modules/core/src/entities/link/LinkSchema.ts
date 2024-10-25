import * as v from 'valibot'

export const LinkSchema = v.object({
	id: v.string(),
	url: v.pipe(v.string(), v.url()),
	label: v.optional(v.string()),
	businessId: v.string(),
})

export const LinkCreateSchema = v.omit(LinkSchema, ['id'])

export const LinkUpdateSchema = v.partial(LinkCreateSchema)
