import type {PostgresJsDatabase} from 'drizzle-orm/postgres-js'
import * as schema from './db/schema/schema.js'

export type IndieDBType = PostgresJsDatabase<typeof schema>

export abstract class CRUDRepositoryPostgres {
  // oxlint-disable-next-line
  protected readonly db: IndieDBType

  constructor(db: IndieDBType) {
    this.db = db
  }

  protected ensure1<T>(records: T[]): T {
    if (records.length !== 1) {
      throw new Error(`Expected an array of 1 but received ${records.length}`)
    }

    if (!records[0]) {
      throw new Error(`Expected a record at 0 but received undefined`)
    }

    return records[0]
  }
}
