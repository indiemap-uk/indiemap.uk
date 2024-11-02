/* The order of the columns is crucial for the Towns dataset! */
/* Also, we want the id column to be the first in all tables. */
/* eslint-disable perfectionist/sort-objects */

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.createTable('towns', {
		id: {notNull: true, primaryKey: true, type: 'int'},
		name: {type: 'varchar(56)'},
		county: {type: 'varchar(32)'},
		country: {type: 'varchar(16)'},
		grid_reference: {type: 'varchar(8)'},
		easting: {type: 'int'},
		northing: {type: 'int'},
		latitude: {type: 'numeric(8, 5)'},
		longitude: {type: 'numeric(8, 5)'},
		elevation: {type: 'int'},
		postcode_sector: {type: 'varchar(6)'},
		local_government_area: {type: 'varchar(44)'},
		nuts_region: {type: 'varchar(24)'},
		type: {type: 'varchar(13)'},
	})

	pgm.createTable('businesses', {
		id: {
			notNull: true,
			primaryKey: true,
			type: 'varchar(90)',
		},
		description: {type: 'text'},
		name: {notNull: true, type: 'varchar'},
		town_id: {
			notNull: true,
			onDelete: 'SET NULL',
			onUpdate: 'CASCADE',
			references: 'towns',
			type: 'int',
		},
	})

	pgm.createTable('links', {
		id: {
			notNull: true,
			primaryKey: true,
			type: 'varchar(90)',
		},
		business_id: {
			notNull: true,
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
			references: 'businesses',
			type: 'varchar(90)',
		},
		label: {type: 'text'},
		url: {notNull: true, type: 'varchar'},
	})
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.dropTable('links')
	pgm.dropTable('businesses')
	pgm.dropTable('towns')
}
