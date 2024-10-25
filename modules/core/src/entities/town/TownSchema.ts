import * as v from 'valibot'

/** Towns are not editable so we only have a single schema */
export const TownSchema = v.object({
	country: v.string(),
	county: v.string(),
	easting: v.number(),
	elevation: v.number(),
	grid_reference: v.string(),
	id: v.number(),
	latitude: v.pipe(v.string(), v.decimal()),
	local_government_area: v.string(),
	longitude: v.pipe(v.string(), v.decimal()),
	name: v.string(),
	northing: v.number(),
	nuts_region: v.string(),
	postcode_sector: v.string(),
	type: v.string(),
})
