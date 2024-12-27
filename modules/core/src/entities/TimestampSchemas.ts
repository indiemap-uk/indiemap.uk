import * as v from 'valibot'

export const TimestampSchema = v.object({
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	updatedAt: v.pipe(v.string(), v.isoTimestamp()),
})
