import * as v from 'valibot'

export const LinkSchema = v.object({
	businessId: v.string(),
	id: v.string(),
	label: v.optional(v.string()),
	url: v.pipe(v.string(), v.url()),
})

export const LinkCreateSchema = v.omit(LinkSchema, ['id'])

export const LinkUpdateSchema = v.partial(LinkCreateSchema)
