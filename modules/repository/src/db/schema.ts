import {sql} from 'drizzle-orm'
import {check, foreignKey, integer, numeric, pgTable, text, timestamp, varchar} from 'drizzle-orm/pg-core'

export const keyv = pgTable('keyv', {
	key: varchar({length: 255}).primaryKey().notNull(),
	value: text(),
})

export const businesses = pgTable(
	'businesses',
	{
		id: varchar({length: 90}).primaryKey().notNull(),
		createdAt: timestamp('created_at', {withTimezone: true, mode: 'string'})
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		description: text(),
		name: varchar().notNull(),
		townId: integer('town_id'),
		updatedAt: timestamp('updated_at', {withTimezone: true, mode: 'string'}).notNull(),
		status: text().default('live').notNull(),
		generatedFromUrls: text().array().notNull().default([]),
	},
	(table) => [
		foreignKey({
			columns: [table.townId],
			foreignColumns: [ukTowns.id],
			name: 'businesses_town_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('set null'),
		check('businesses_status_check', sql`status = ANY (ARRAY['live'::text, 'draft'::text])`),
	],
)

export const links = pgTable(
	'links',
	{
		id: varchar({length: 90}).primaryKey().notNull(),
		businessId: varchar('business_id', {length: 90}).notNull(),
		label: text(),
		url: varchar().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.businessId],
			foreignColumns: [businesses.id],
			name: 'links_business_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
	],
)

export const ukTowns = pgTable('uk_towns', {
	id: integer().primaryKey().notNull(),
	name: varchar({length: 56}),
	county: varchar({length: 32}),
	country: varchar({length: 16}),
	gridReference: varchar('grid_reference', {length: 8}),
	easting: integer(),
	northing: integer(),
	latitude: numeric({precision: 8, scale: 5}),
	longitude: numeric({precision: 8, scale: 5}),
	elevation: integer(),
	postcodeSector: varchar('postcode_sector', {length: 6}),
	localGovernmentArea: varchar('local_government_area', {length: 44}),
	nutsRegion: varchar('nuts_region', {length: 24}),
	type: varchar({length: 13}),
})

export const businessLocations = pgTable(
	'business_locations',
	{
		businessId: varchar('business_id', {length: 90}).notNull(),
		locationId: varchar('location_id', {length: 90}).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.businessId],
			foreignColumns: [businesses.id],
			name: 'business_locations_business_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		foreignKey({
			columns: [table.locationId],
			foreignColumns: [locations.id],
			name: 'business_locations_location_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
	],
)

export const locations = pgTable('locations', {
	id: varchar({length: 90}).primaryKey().notNull(),
	address: text(),
	label: text(),
	latitude: numeric({precision: 8, scale: 5}),
	longitude: numeric({precision: 8, scale: 5}),
})
