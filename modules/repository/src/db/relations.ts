import {relations} from 'drizzle-orm/relations'
import {ukTowns, businesses, links, businessLocations, locations} from './schema.js'

export const businessesRelations = relations(businesses, ({one, many}) => ({
	ukTown: one(ukTowns, {
		fields: [businesses.townId],
		references: [ukTowns.id],
	}),
	links: many(links),
	businessLocations: many(businessLocations),
}))

export const ukTownsRelations = relations(ukTowns, ({many}) => ({
	businesses: many(businesses),
}))

export const linksRelations = relations(links, ({one}) => ({
	business: one(businesses, {
		fields: [links.businessId],
		references: [businesses.id],
	}),
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

export const locationsRelations = relations(locations, ({many}) => ({
	businessLocations: many(businessLocations),
}))
