import * as v from 'valibot'

export const SummaryResponseSchema = v.object({
	businessTitle: v.string(),
	links: v.optional(v.array(v.string())),
	longDescription: v.optional(v.string()),
	madeInUk: v.optional(v.picklist(['all', 'some', 'none', 'unknown'])),
	meta: v.optional(v.string()),
	products: v.optional(v.array(v.string())),
	shortDescription: v.string(),
})

export type SummaryResponseType = v.InferOutput<typeof SummaryResponseSchema>
