import maplibere from 'maplibre-gl'

const {LngLat, LngLatBounds} = maplibere

// Center of UK picked from
// https://en.wikipedia.org/wiki/Centre_points_of_the_United_Kingdom > Great Britain (mainland only)
export const centerOfUK = {lat: 53.825564, lon: -2.421975}

// Bound of the UK picked from (and extended slightly):
// https://gist.github.com/graydon/11198540#file-country-bounding-boxes-py-L61
const sw = new LngLat(-8.5, 49.8)
const ne = new LngLat(1.9, 60.0)
export const boundsOfUK = new LngLatBounds(sw, ne)

export const isInsideUK = (lat: number, lon: number) => boundsOfUK.contains(new LngLat(lon, lat))
