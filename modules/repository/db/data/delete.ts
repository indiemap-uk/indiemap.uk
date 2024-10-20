/**
 * Removes the data from the tables, except for the town data as that takes a long time to reload
 */
import * as db from "zapatos/db"
import {pool} from "../../src/pool.js"

const deleteData = async () => {
	await db.sql`DELETE FROM ${"links"}`.run(pool)
	await db.sql`DELETE FROM ${"indies"}`.run(pool)

	console.log("Deleted all data from the tables (except towns)")

	await pool.end()
}

deleteData()
