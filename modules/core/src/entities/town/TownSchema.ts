import * as v from 'valibot'

/** Towns are not editable, so there is no create- or update schema */
export const TownSchema = v.object({
	country: v.string(),
	county: v.string(),
	easting: v.number(),
	elevation: v.number(),
	grid_reference: v.string(),
	id: v.pipe(v.number(), v.minValue(1), v.maxValue(50_000)),
	latitude: v.number(),
	local_government_area: v.string(),
	longitude: v.number(),
	name: v.string(),
	northing: v.number(),
	nuts_region: v.string(),
	postcode_sector: v.string(),
	type: v.string(),
})

export const TownSearchSchema = v.pipe(v.string(), v.minLength(3), v.maxLength(20))

export const TownSearchResultSchema = v.pick(TownSchema, ['id', 'name', 'county'])
