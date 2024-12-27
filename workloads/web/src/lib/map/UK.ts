// Center of UK picked from (adjusted)
// https://en.wikipedia.org/wiki/Centre_points_of_the_United_Kingdom > Great Britain (mainland only)
export const centerOfUK = {lat: 53.825564, lon: -2.421975}

// Bound of the UK picked from (and extended slightly):
// https://gist.github.com/graydon/11198540#file-country-bounding-boxes-py-L61
// Defined as 4 numbers: west, south, east, north
// See https://github.com/maplibre/maplibre-gl-js/blob/87486a5ef2085e600e8fa4e31252629dd8488dcd/src/geo/lng_lat_bounds.ts#L58
const swLng = -8.5
const swLat = 46.0
const neLng = 1.9
const neLat = 60.0
export const boundsOfUK = [swLng, swLat, neLng, neLat]

export const isInsideUK = (lat: number, lon: number) => {
	const containsLatitude = swLat <= lat && lat <= neLat
	const containsLongitude = swLng <= lon && lon <= neLng

	return containsLatitude && containsLongitude
}
