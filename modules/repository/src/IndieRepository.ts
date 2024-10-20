import type {Pool} from "pg"
import * as db from "zapatos/db"

export class IndieRepository {
	constructor(private readonly pool: Pool) {}

	async getAll({limit = 999}: {limit?: number}) {
		return db.select("indies", db.all, {limit}).run(this.pool)
	}
}
