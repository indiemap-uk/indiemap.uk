import * as v from 'valibot'

export const TimestampSchema = v.object({
	createdAt: v.date(),
	updatedAt: v.date(),
})
