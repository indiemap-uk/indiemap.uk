import type * as s from 'zapatos/schema'

import {
	BusinessCreateSchema,
	type BusinessCreateType,
	type BusinessRepository,
	BusinessSchema,
	newBusinessId,
} from '@i/core/business'
import * as v from 'valibot'
import * as db from 'zapatos/db'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {objToCamel} from './objToCamel.js'
import {objToSnake} from './objToSnake.js'

export class BusinessRepositoryPostgres extends CRUDRepositoryPostgres implements BusinessRepository {
	private recordToEntity(record: s.businesses.Selectable) {
		return v.parse(BusinessSchema, Object.assign({links: []}, objToCamel(record)))
	}

	async create(data: BusinessCreateType) {
		const toInsert = Object.assign(
			{id: newBusinessId()},
			objToSnake<s.businesses.Insertable>(v.parse(BusinessCreateSchema, data)),
		)

		const record = await db.insert('businesses', toInsert).run(this.pool)

		return this.recordToEntity(record)
	}

	async list() {
		const records = await db.select('businesses', db.all).run(this.pool)

		return records.map((r) => this.recordToEntity(r))
	}
}
