import type * as s from 'zapatos/schema'

import {
	BusinessCreateSchema,
	type BusinessCreateType,
	type BusinessIdType,
	type BusinessRepository,
	BusinessSchema,
	type BusinessType,
	newBusinessId,
} from '@i/core/business'
import * as v from 'valibot'
import * as db from 'zapatos/db'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {objToCamel} from './objToCamel.js'
import {objToSnake} from './objToSnake.js'

export class BusinessRepositoryPostgres extends CRUDRepositoryPostgres implements BusinessRepository {
	private recordToEntity(record: s.businesses.Selectable) {
		return v.parse(BusinessSchema, objToCamel(record))
	}
	async create(data: BusinessCreateType) {
		const toInsert = Object.assign(
			{id: newBusinessId()},
			objToSnake<s.businesses.Insertable>(v.parse(BusinessCreateSchema, data)),
		)

		const record = await db.insert('businesses', toInsert).run(this.pool)

		return this.recordToEntity(record)
	}

	async delete(id: BusinessIdType) {
		const deleted = await db.deletes('businesses', {id: id.toString()}).run(this.pool)

		if (deleted.length !== 1) {
			throw new Error(`Delete error, deleted length is not 1 but ${deleted.length}`)
		}
	}

	async getById(id: BusinessIdType): Promise<BusinessType | null> {
		return db
			.selectExactlyOne('businesses', {id: id.toString()})
			.run(this.pool)
			.then((record) => this.recordToEntity(record))
	}

	async list() {
		const records = await db.select('businesses', db.all).run(this.pool)

		return records.map((r) => this.recordToEntity(r))
	}

	async update(data: BusinessType) {
		const toUpdate = objToSnake<s.businesses.Updatable>(v.parse(BusinessSchema, data))

		const record = await db.update('businesses', toUpdate, {id: data.id.toString()}).run(this.pool)

		if (!record?.[0]) {
			throw new Error('Update failed, no record returned')
		}

		return this.recordToEntity(record[0])
	}
}
