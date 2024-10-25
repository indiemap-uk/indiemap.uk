import * as db from 'zapatos/db'
import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {type TownRepository, TownSchema} from '@i/core/town'
import * as v from 'valibot'
import type * as s from 'zapatos/schema'

export class TownRepositoryPostgres extends CRUDRepositoryPostgres implements TownRepository {
	private toSchema = (record: object) => {
		return v.parse(TownSchema, record)
	}

	async getById(id: number) {
		const record = await db.selectExactlyOne('towns', {id}).run(this.pool)

		return this.toSchema(record)
	}

	async getRandom() {
		const records = (await db.sql`SELECT * FROM towns ORDER BY random() LIMIT 1`.run(this.pool)) as s.towns.Selectable[]

		if (!records?.[0]) {
			throw new Error('No random town found')
		}

		return this.toSchema(records[0])
	}
}
