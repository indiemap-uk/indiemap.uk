import debug from 'debug'
import type {Logger as DrizzleLogger} from 'drizzle-orm/logger'
import {once} from 'es-toolkit'
import {Pool} from 'pg'

import {drizzle} from 'drizzle-orm/node-postgres'

const queryDebug = debug('indie:db:query')

class Logger implements DrizzleLogger {
  logQuery(query: string, params: unknown[]): void {
    queryDebug(query, params)
  }
}

export const getDb = once((url: string) => {
  if (!url) {
    throw new Error('db url is not set')
  }

  const pool = new Pool({connectionString: url})

  const db = drizzle({client: pool, logger: new Logger(), casing: 'snake_case'})

  return {pool, db}
})
