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
	pgm.createSchema('authjs')

	// Schema from https://authjs.dev/getting-started/adapters/pg
	pgm.sql(`
        CREATE TABLE authjs.verification_token
        (
        identifier TEXT NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        token TEXT NOT NULL,
        
        PRIMARY KEY (identifier, token)
        );
        
        CREATE TABLE authjs.accounts
        (
        id SERIAL,
        "userId" INTEGER NOT NULL,
        type VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        "providerAccountId" VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        id_token TEXT,
        scope TEXT,
        session_state TEXT,
        token_type TEXT,
        
        PRIMARY KEY (id)
        );
        
        CREATE TABLE authjs.sessions
        (
        id SERIAL,
        "userId" INTEGER NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        "sessionToken" VARCHAR(255) NOT NULL,
        
        PRIMARY KEY (id)
        );
        
        CREATE TABLE authjs.users
        (
        id SERIAL,
        name VARCHAR(255),
        email VARCHAR(255),
        "emailVerified" TIMESTAMPTZ,
        image TEXT,
        
        PRIMARY KEY (id)
        );
    `)
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.sql(`
        DROP TABLE IF EXISTS authjs.verification_token;
        DROP TABLE IF EXISTS authjs.accounts;
        DROP TABLE IF EXISTS authjs.sessions;
        DROP TABLE IF EXISTS authjs.users;
    `)

	pgm.dropSchema('authjs')
}
