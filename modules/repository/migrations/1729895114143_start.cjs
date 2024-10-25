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
		id: {type: 'int', notNull: true, primaryKey: true},
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
		id: {type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('gen_random_uuid()')},
		name: {type: 'varchar', notNull: true},
		description: {type: 'text'},
		town_id: {type: 'int', notNull: true, references: 'towns', onDelete: 'SET NULL', onUpdate: 'CASCADE'},
	})

	pgm.createTable('links', {
		id: {type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('gen_random_uuid()')},
		url: {type: 'varchar', notNull: true},
		label: {type: 'text'},
		business_id: {type: 'uuid', notNull: true, references: 'businesses', onDelete: 'CASCADE', onUpdate: 'CASCADE'},
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
