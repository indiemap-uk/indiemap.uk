import * as v from 'valibot'

/**
 * Schema representing an LLM-generated answer about a business
 */
export const AnswerSchema = v.object({
	links: v.optional(v.array(v.string())),
	longDescription: v.optional(v.string()),
	madeInUk: v.optional(v.string()),
	meta: v.optional(v.string()),
	products: v.optional(v.array(v.string())),
	shortDescription: v.string(),
	title: v.string(),
})
