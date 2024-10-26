/**
 * Removes the data from the tables, except for the town data as that takes a long time to reload
 */
import * as db from 'zapatos/db'

import {getPool} from '../src/getPool.js'

const deleteData = async () => {
	const pool = getPool(process.env.DATABASE_URL!)
	await db.sql`DELETE FROM ${'links'}`.run(pool)
	await db.sql`DELETE FROM ${'businesses'}`.run(pool)

	console.log('Deleted all data from the tables (except towns)')

	await pool.end()
}

await deleteData()
