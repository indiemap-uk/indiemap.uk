import {sql} from 'drizzle-orm'
import {relations} from 'drizzle-orm'
import {integer, numeric, pgTable, text, timestamp, varchar, pgEnum, primaryKey} from 'drizzle-orm/pg-core'

// Enums for better type safety
export const businessStatusEnum = pgEnum('business_status', ['live', 'draft'])

export const keyv = pgTable('keyv', {
	key: varchar({length: 255}).primaryKey().notNull(),
	value: text(),
})

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

export const businesses = pgTable('businesses', {
	id: varchar({length: 90}).primaryKey().notNull(),
	townId: integer('town_id').references(() => ukTowns.id, {
		onUpdate: 'cascade',
		onDelete: 'set null'
	}),
	name: varchar().notNull(),
	description: text(),
	status: businessStatusEnum().default('live').notNull(),
	generatedFromUrls: text().array().notNull().default([]),
	createdAt: timestamp('created_at', {withTimezone: true, mode: 'string'})
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp('updated_at', {withTimezone: true, mode: 'string'}).notNull(),
})

export const links = pgTable('links', {
	id: varchar({length: 90}).primaryKey().notNull(),
	businessId: varchar('business_id', {length: 90})
		.notNull()
		.references(() => businesses.id, {
			onUpdate: 'cascade',
			onDelete: 'cascade'
		}),
	label: text(),
	url: varchar().notNull(),
})

export const locations = pgTable('locations', {
	id: varchar({length: 90}).primaryKey().notNull(),
	address: text(),
	label: text(),
	latitude: numeric({precision: 8, scale: 5}),
	longitude: numeric({precision: 8, scale: 5}),
})

export const businessLocations = pgTable('business_locations', {
	businessId: varchar('business_id', {length: 90})
		.notNull()
		.references(() => businesses.id, {
			onUpdate: 'cascade',
			onDelete: 'cascade'
		}),
	locationId: varchar('location_id', {length: 90})
		.notNull()
		.references(() => locations.id, {
			onUpdate: 'cascade',
			onDelete: 'cascade'
		}),
}, (table) => [
	primaryKey({columns: [table.businessId, table.locationId]})
])

// Relations for better querying
export const ukTownsRelations = relations(ukTowns, ({many}) => ({
	businesses: many(businesses),
}))

export const businessesRelations = relations(businesses, ({one, many}) => ({
	town: one(ukTowns, {
		fields: [businesses.townId],
		references: [ukTowns.id],
	}),
	links: many(links),
	locations: many(businessLocations),
}))

export const linksRelations = relations(links, ({one}) => ({
	business: one(businesses, {
		fields: [links.businessId],
		references: [businesses.id],
	}),
}))

export const locationsRelations = relations(locations, ({many}) => ({
	businesses: many(businessLocations),
}))

export const businessLocationsRelations = relations(businessLocations, ({one}) => ({
	business: one(businesses, {
		fields: [businessLocations.businessId],
		references: [businesses.id],
	}),
	location: one(locations, {
		fields: [businessLocations.locationId],
		references: [locations.id],
	}),
}))
