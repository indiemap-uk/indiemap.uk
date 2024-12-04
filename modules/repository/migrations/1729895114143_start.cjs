/* The order of the columns is crucial for the Towns dataset! */
/* Also, we want the id column to be the first in all tables. */
/* eslint-disable perfectionist/sort-objects */

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = {
	typeID: {
		notNull: true,
		primaryKey: true,
		type: 'varchar(90)',
	},
}

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
		id: 'typeID',
		created_at: {type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp')},
		description: {type: 'text'},
		name: {notNull: true, type: 'varchar'},
		town_id: {
			notNull: true,
			onDelete: 'SET NULL',
			onUpdate: 'CASCADE',
			references: 'towns',
			type: 'int',
		},
		updated_at: {type: 'timestamptz', notNull: true},
	})

	pgm.sql(`create or replace function update_updatedat_column () returns trigger as $$
		BEGIN
			NEW.updated_at = NOW();
			RETURN NEW;
		END;
		$$ language plpgsql;`)

	pgm.sql(`create trigger update_updatedat_trigger before
		update on businesses for each row
		execute function update_updatedat_column ();`)

	pgm.createTable('links', {
		id: 'typeID',
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

	pgm.createTable('locations', {
		id: 'typeID',
		address: {type: 'text'},
		label: {type: 'text'},
		latitude: {type: 'numeric(8, 5)'},
		longitude: {type: 'numeric(8, 5)'},
	})

	pgm.createTable('business_locations', {
		business_id: {
			notNull: true,
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
			references: 'businesses',
			type: 'varchar(90)',
		},
		location_id: {
			notNull: true,
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
			references: 'locations',
			type: 'varchar(90)',
		},
	})
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.dropTable('links')
	pgm.dropTable('business_locations')
	pgm.dropTable('locations')
	pgm.dropTable('businesses')
	pgm.dropTable('towns')
}
