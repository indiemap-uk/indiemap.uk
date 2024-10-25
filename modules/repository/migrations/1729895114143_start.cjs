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
		country: {type: 'varchar(16)'},
		county: {type: 'varchar(32)'},
		easting: {type: 'int'},
		elevation: {type: 'int'},
		grid_reference: {type: 'varchar(8)'},
		id: {notNull: true, primaryKey: true, type: 'int'},
		latitude: {type: 'numeric(8, 5)'},
		local_government_area: {type: 'varchar(44)'},
		longitude: {type: 'numeric(8, 5)'},
		name: {type: 'varchar(56)'},
		northing: {type: 'int'},
		nuts_region: {type: 'varchar(24)'},
		postcode_sector: {type: 'varchar(6)'},
		type: {type: 'varchar(13)'},
	})

	pgm.createTable('businesses', {
		description: {type: 'text'},
		id: {default: pgm.func('gen_random_uuid()'), notNull: true, primaryKey: true, type: 'uuid'},
		name: {notNull: true, type: 'varchar'},
		town_id: {notNull: true, onDelete: 'SET NULL', onUpdate: 'CASCADE', references: 'towns', type: 'int'},
	})

	pgm.createTable('links', {
		business_id: {notNull: true, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: 'businesses', type: 'uuid'},
		id: {default: pgm.func('gen_random_uuid()'), notNull: true, primaryKey: true, type: 'uuid'},
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
