import {relations} from 'drizzle-orm'
import {integer, pgEnum, pgTable, primaryKey, real, text, timestamp, varchar} from 'drizzle-orm/pg-core'

/**
 * SCHEMAS
 */

export const timestamps = {
  createdAt: timestamp({withTimezone: true, mode: 'string'}).defaultNow().notNull(),
  updatedAt: timestamp({withTimezone: true, mode: 'string'}).defaultNow().notNull(),
}

export const businessStatusEnum = pgEnum('business_status', ['live', 'draft'])
export const noteEntityTypeEnum = pgEnum('note_entity_type', ['source'])

export const ukTowns = pgTable('uk_towns', {
  id: integer().primaryKey().notNull(),
  name: varchar({length: 56}),
  county: varchar({length: 32}),
  country: varchar({length: 16}),
  gridReference: varchar({length: 8}),
  easting: integer(),
  northing: integer(),
  latitude: real(),
  longitude: real(),
  elevation: integer(),
  postcodeSector: varchar({length: 6}),
  localGovernmentArea: varchar({length: 44}),
  nutsRegion: varchar({length: 24}),
  type: varchar({length: 13}),
})

export const businesses = pgTable('businesses', {
  id: varchar({length: 90}).primaryKey().notNull(),
  description: text(),
  name: varchar().notNull(),
  status: businessStatusEnum().default('live').notNull(),
  townId: integer().references(() => ukTowns.id, {onUpdate: 'cascade', onDelete: 'set null'}),
  county: varchar({length: 40}),
  ...timestamps,
})

export const links = pgTable('links', {
  id: varchar({length: 90}).primaryKey().notNull(),
  businessId: varchar({length: 90})
    .notNull()
    .references(() => businesses.id, {onUpdate: 'cascade', onDelete: 'cascade'}),
  label: text(),
  url: varchar().notNull(),
  order: integer().notNull().default(0),
})

export const locations = pgTable('locations', {
  id: varchar({length: 90}).primaryKey().notNull(),
  address: text(),
  label: text(),
  latitude: real(),
  longitude: real(),
})

export const businessLocations = pgTable(
  'business_locations',
  {
    businessId: varchar({length: 90})
      .notNull()
      .references(() => businesses.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    locationId: varchar({length: 90})
      .notNull()
      .references(() => locations.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
  },
  (table) => [primaryKey({columns: [table.businessId, table.locationId]})],
)

export const sources = pgTable('sources', {
  id: varchar({length: 90}).primaryKey().notNull(),
  name: varchar(),
  urls: varchar().array().notNull(),
  businessId: varchar({length: 90})
    .references(() => businesses.id, {
      onUpdate: 'cascade',
      onDelete: 'set null',
    }),
  ...timestamps,
})

export const products = pgTable('products', {
  id: varchar({length: 90}).primaryKey().notNull(),
  originalName: varchar({length: 255}).notNull(),
  businessId: varchar({length: 90})
    .references(() => businesses.id, {
      onUpdate: 'cascade',
      onDelete: 'set null',
    }),
  ...timestamps,
})

export const notes = pgTable('notes', {
  id: varchar({length: 90}).primaryKey().notNull(),
  entityType: noteEntityTypeEnum().notNull(),
  entityId: varchar({length: 90}).notNull(),
  content: text().notNull(),
  ...timestamps,
})

/**
 * RELATIONS
 */

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
  sources: many(sources),
  products: many(products),
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

export const sourcesRelations = relations(sources, ({one, many}) => ({
  business: one(businesses, {
    fields: [sources.businessId],
    references: [businesses.id],
  }),
  notes: many(notes, {
    relationName: 'sourceNotes',
  }),
}))

export const productsRelations = relations(products, ({one}) => ({
  business: one(businesses, {
    fields: [products.businessId],
    references: [businesses.id],
  }),
}))

export const notesRelations = relations(notes, ({one}) => ({
  source: one(sources, {
    fields: [notes.entityId],
    references: [sources.id],
    relationName: 'sourceNotes',
  }),
}))
