import type {Pool} from 'pg'

import * as zdb from 'zapatos/db'

export abstract class CRUDRepositoryPostgres {
  constructor(
    protected readonly pool: Pool,
    protected readonly db: typeof zdb,
  ) {}
}
