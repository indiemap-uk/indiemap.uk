/**
 * Based on an example fetched from https://api.geocodify.com/v2/geocode,
 * see GeocodifyExample.json
 *
 * Types generated with https://transform.tools/typescript-to-json-schema
 * Supposed to be GeoJSON.
 * Documentation: https://geocodify.com/api-documentation
 **/

export interface Addendum {
	osm: Osm
}

export interface Feature {
	bbox: number[]
	geometry: Geometry
	properties: Properties
	type: string
}

export interface Geocoding {
	attribution: string
	query: Query
	terms: string
	timestamp: number
	version: string
}

export interface Geometry {
	coordinates: number[]
	type: string
}

export interface Lang {
	defaulted: boolean
	iso6391: string
	iso6393: string
	name: string
	via: string
}

export interface Meta {
	code: number
}

export interface Osm {
	phone: string
	website: string
}

export interface ParsedText {
	city: string
	county: string
	housenumber: string
	postalcode: string
	query: string
	street: string
}

export interface Properties {
	accuracy: string
	addendum: Addendum
	confidence: number
	county: string
	county_gid: string
	gid: string
	housenumber: string
	id: string
	label: string
	layer: string
	localadmin: string
	localadmin_gid: string
	locality: string
	locality_gid: string
	macrocounty: string
	macrocounty_gid: string
	match_type: string
	name: string
	source: string
	source_id: string
	street: string
}

export interface Query {
	lang: Lang
	parsed_text: ParsedText
	parser: string
	private: boolean
	querySize: number
	size: number
	text: string
}

export interface Response {
	bbox: number[]
	features: Feature[]
	geocoding: Geocoding
	type: string
}

export interface Root {
	meta: Meta
	response: Response
}
