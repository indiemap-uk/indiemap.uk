import type * as s from 'zapatos/schema'

import {
	BusinessCreateSchema,
	type BusinessCreateType,
	type BusinessIdType,
	type BusinessRepository,
	BusinessResolvedSchema,
	BusinessSchema,
	type BusinessType,
	newBusinessId,
} from '@i/core/business'
import * as v from 'valibot'
import * as db from 'zapatos/db'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {objToCamel} from './objToCamel.js'
import {objToSnake} from './objToSnake.js'

type BusinessCoreRecord = s.businesses.Selectable
type BusinessResolvedRecord = {town: s.towns.JSONSelectable} & s.businesses.JSONSelectable

export class BusinessRepositoryPostgres extends CRUDRepositoryPostgres implements BusinessRepository {
	private recordToEntity(record: BusinessCoreRecord | BusinessResolvedRecord, townRecord?: s.towns.JSONSelectable) {
		try {
			const town = 'town' in record ? record.town : townRecord

			return v.parse(BusinessResolvedSchema, objToCamel({...record, town}))
		} catch (error: unknown) {
			if (v.isValiError(error)) {
				console.error('Validation error', JSON.stringify(error.issues, null, 2))
			}

			throw error
		}
	}

	async create(data: BusinessCreateType) {
		const toInsert = Object.assign(
			{id: newBusinessId()},
			objToSnake<s.businesses.Insertable>(v.parse(BusinessCreateSchema, data)),
		)

		const record = await db.insert('businesses', toInsert).run(this.pool)
		const town = await db.selectExactlyOne('towns', {id: record.town_id}).run(this.pool)

		return this.recordToEntity(record, town)
	}

	async delete(id: BusinessIdType) {
		const deleted = await db.deletes('businesses', {id: id.toString()}).run(this.pool)

		if (deleted.length !== 1) {
			throw new Error(`Delete error, deleted length is not 1 but ${deleted.length}`)
		}
	}

	async getById(id: BusinessIdType) {
		return db
			.selectOne(
				'businesses',
				{id: id.toString()},
				{
					lateral: {
						town: db.selectExactlyOne('towns', {id: db.parent('town_id')}),
					},
				},
			)
			.run(this.pool)
			.then((record) => (record ? this.recordToEntity(record) : null))
	}

	async list() {
		const records = await db
			.select('businesses', db.all, {
				lateral: {
					town: db.selectExactlyOne('towns', {id: db.parent('town_id')}),
				},
				limit: 100,
				order: {by: 'id', direction: 'ASC'},
			})
			.run(this.pool)

		return records.map((r) => this.recordToEntity(r))
	}

	async update(data: BusinessType) {
		const toUpdate = objToSnake<s.businesses.Updatable>(v.parse(BusinessSchema, data))

		const record = await db.update('businesses', toUpdate, {id: data.id.toString()}).run(this.pool)

		if (!record?.[0]) {
			throw new Error('Update failed, no record returned')
		}

		const town = await db.selectExactlyOne('towns', {id: record[0].town_id}).run(this.pool)

		return this.recordToEntity(record[0], town)
	}
}
