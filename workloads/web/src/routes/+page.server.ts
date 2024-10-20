import {IndieRepository} from "@i/repository/IndieRepository"
import {pool} from "@i/repository/pool"

export const load = async () => {
	const repo = new IndieRepository(pool)

	const indies = await repo.getAll({limit: 10})

	return {
		indies,
	}
}
