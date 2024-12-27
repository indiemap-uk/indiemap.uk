import * as v from 'valibot'

export const TimestampSchema = v.object({
	createdAt: v.union([v.date(), v.pipe(v.string(), v.isoTimestamp())]),
	updatedAt: v.union([v.date(), v.pipe(v.string(), v.isoTimestamp())]),
})
