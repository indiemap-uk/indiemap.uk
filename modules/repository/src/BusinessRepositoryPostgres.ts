import type * as s from 'zapatos/schema'

import {
	BusinessCreateSchema,
	type BusinessCreateType,
	type BusinessIdType,
	type BusinessListArgs,
	type BusinessRepository,
	BusinessResolvedSchema,
	BusinessSchema,
	type BusinessType,
	newBusinessId,
} from '@i/core/business'
import {snakeCase} from 'es-toolkit'
import * as v from 'valibot'
import * as db from 'zapatos/db'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {dbToEntity} from './dbToEntity.js'
import {objToSnake} from './objToSnake.js'

type BusinessCoreRecord = s.businesses.JSONSelectable | s.businesses.Selectable
type BusinessResolvedRecord = s.businesses.JSONSelectable & {town: s.uk_towns.JSONSelectable}

export class BusinessRepositoryPostgres extends CRUDRepositoryPostgres implements BusinessRepository {
	async create(data: BusinessCreateType) {
		const createDate = new Date().toISOString()
		const toInsert = Object.assign(
			{
				created_at: createDate,
				id: newBusinessId(),
				updated_at: createDate,
			},
			objToSnake<s.businesses.Insertable>(v.parse(BusinessCreateSchema, data)),
		)

		const record = await db.insert('businesses', toInsert).run(this.pool)

		return dbToEntity(record, BusinessSchema)
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
						town: db.selectExactlyOne('uk_towns', {id: db.parent('town_id')}),
					},
				},
			)
			.run(this.pool)
			.then((record) => (record ? this.toResolvedBusiness(record) : null))
	}

	async list(userArgs: BusinessListArgs) {
		const args = {
			limit: userArgs.limit ?? 10,
			offset: userArgs.offset ?? 0,
			order: {
				by: snakeCase(userArgs.order?.by ?? 'id') as s.SQLForTable<'businesses'>,
				direction: userArgs.order?.direction ?? 'ASC',
			},
		}

		const records = await db
			.select('businesses', db.all, {
				lateral: {
					town: db.selectExactlyOne('uk_towns', {id: db.parent('town_id')}),
				},
				limit: args.limit,
				offset: args.offset,
				order: args.order,
			})
			.run(this.pool)

		return records.map((r) => this.toResolvedBusiness(r))
	}

	async update(data: BusinessType) {
		const toUpdate = objToSnake<s.businesses.Updatable>(v.parse(BusinessSchema, data))

		const record = await db.update('businesses', toUpdate, {id: data.id.toString()}).run(this.pool)

		if (!record?.[0]) {
			throw new Error('Update failed, no record returned')
		}

		const town = await db.selectExactlyOne('uk_towns', {id: record[0].town_id}).run(this.pool)

		return this.toResolvedBusiness(record[0], town)
	}

	private toResolvedBusiness(
		record: BusinessCoreRecord | BusinessResolvedRecord,
		townRecord?: s.uk_towns.JSONSelectable,
	) {
		const town = 'town' in record ? record.town : townRecord

		return dbToEntity({...record, town}, BusinessResolvedSchema)
	}
}
