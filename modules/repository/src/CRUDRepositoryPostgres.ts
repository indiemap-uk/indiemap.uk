import type {Pool} from 'pg'

export abstract class CRUDRepositoryPostgres {
	constructor(protected readonly pool: Pool) {}
}
