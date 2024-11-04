import type * as s from 'zapatos/schema'

import {
	type TownRepository,
	TownSchema,
	TownSearchResultSchema,
	type TownSearchResultType,
	TownSearchSchema,
} from '@i/core/town'
import * as v from 'valibot'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'

export class TownRepositoryPostgres extends CRUDRepositoryPostgres implements TownRepository {
	private toSchema = (record: object) => {
		try {
			return v.parse(TownSchema, record)
		} catch (error: unknown) {
			if (v.isValiError(error)) {
				console.error('Validation error', JSON.stringify(error.issues, null, 2))
			}

			throw error
		}
	}

	async getById(id: number) {
		const record = await this.db.selectExactlyOne('towns', {id}).run(this.pool)

		return this.toSchema(record)
	}

	async getRandom() {
		const records = (await this.db.sql`SELECT * FROM towns ORDER BY random() LIMIT 1`.run(
			this.pool,
		)) as s.towns.Selectable[]

		if (!records?.[0]) {
			throw new Error('No random town found')
		}

		return this.toSchema(records[0])
	}

	async search(qInput: string): Promise<TownSearchResultType[]> {
		const q = v.parse(TownSearchSchema, qInput)

		const records = await this.db.sql`SELECT id, name, county 
		FROM ${'towns'}
		WHERE ${{
			name: this.db.sql`LOWER(${this.db.self}) LIKE(${this.db.param(`${q.toLowerCase()}%`)})`,
		}}
		LIMIT 25`.run(this.pool)

		return records.map((r) => v.parse(TownSearchResultSchema, r))
	}
}
