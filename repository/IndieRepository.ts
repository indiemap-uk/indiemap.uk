import type { Pool } from "pg";
import * as db from "zapatos/db";

export class IndieRepository {
	constructor(private readonly pool: Pool) {}

	getAll = async () => {
		return db.select("indies", db.all).run(this.pool);
	};
}
