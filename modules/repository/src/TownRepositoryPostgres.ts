import type * as s from 'zapatos/schema'

import {
	type TownRepository,
	TownSchema,
	TownSearchResultSchema,
	type TownSearchResultType,
	TownSearchSchema,
} from '@i/core/town'
import Big from 'big.js'
import * as v from 'valibot'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'

export class TownRepositoryPostgres extends CRUDRepositoryPostgres implements TownRepository {
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

	async getRandoms(count: number) {
		const records = (await this.db.sql`SELECT * FROM towns ORDER BY random() LIMIT ${this.db.param(count)}`.run(
			this.pool,
		)) as s.towns.Selectable[]

		return records.map(this.toSchema)
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

	private toSchema = (record: s.towns.JSONSelectable | s.towns.Selectable) => {
		try {
			return v.parse(TownSchema, {
				...record,
				latitude: Big(record.latitude ?? 0).toNumber(),
				longitude: Big(record.longitude ?? 0).toNumber(),
			})
		} catch (error: unknown) {
			if (v.isValiError(error)) {
				console.error('Validation error', JSON.stringify(error.issues, null, 2))
			}

			throw error
		}
	}
}
