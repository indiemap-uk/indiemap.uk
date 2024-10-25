import * as v from 'valibot'

/** Towns are not editable so we only have a single schema */
export const TownSchema = v.object({
	id: v.number(),
	name: v.string(),
	county: v.string(),
	country: v.string(),
	grid_reference: v.string(),
	easting: v.number(),
	northing: v.number(),
	latitude: v.pipe(v.string(), v.decimal()),
	longitude: v.pipe(v.string(), v.decimal()),
	elevation: v.number(),
	postcode_sector: v.string(),
	local_government_area: v.string(),
	nuts_region: v.string(),
	type: v.string(),
})
