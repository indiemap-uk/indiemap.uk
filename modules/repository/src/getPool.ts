import Debug from 'debug'
import pg from 'pg'
import * as db from 'zapatos/db'

const cache: Map<string, pg.Pool> = new Map()
const debug = Debug('indie:pool')

export const getPool = (connectionString: string): pg.Pool => {
	if (!connectionString) {
		throw new Error('No connection string provided')
	}

	const existingPool = cache.get(connectionString)

	if (existingPool) {
		debug(`pool cache hit`)
		return existingPool
	}

	console.log(`pool cache miss`)
	const p = new pg.Pool({connectionString})
	p.on('error', (err) => console.error(err)) // don't let a pg restart kill your app

	db.enableCustomJSONParsingForLargeNumbers(pg)

	cache.set(connectionString, p)

	return p
}
