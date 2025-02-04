import {Reactivity} from '@effect/experimental'
import {NodeFileSystem} from '@effect/platform-node'
import {SqliteClient} from '@effect/sql-sqlite-node'
import type {SqlError} from '@effect/sql/SqlError'
import {Context, Effect} from 'effect'

/**
 * A Key Vaulue store service based on SQLite.
 */
export class KVStoreService extends Context.Tag('KVStoreService')<
	KVStoreService,
	{
		readonly get: (key: string) => Effect.Effect<string | undefined, SqlError>
		readonly set: (key: string, value: string) => Effect.Effect<void | undefined, SqlError>
	}
>() {}

export const KVStore = Effect.gen(function* () {
	const sql = yield* makeClient
	yield* sql`CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)`

	return {
		get: (key: string) =>
			Effect.gen(function* () {
				const row = yield* sql`SELECT value FROM kv WHERE key = ${key} LIMIT 1`
				return row[0]?.value ? String(row[0].value) : undefined
			}),

		set: (key: string, value: string) =>
			Effect.gen(function* () {
				yield* sql`INSERT INTO kv (key, value) VALUES (${key}, ${value})
                ON CONFLICT(key) DO UPDATE SET value = excluded.value`
			}),
	}
})

const makeClient = Effect.gen(function* () {
	const dir = '.'
	return yield* SqliteClient.make({
		filename: dir + '/kv.db',
	})
}).pipe(Effect.provide([NodeFileSystem.layer, Reactivity.layer]))
