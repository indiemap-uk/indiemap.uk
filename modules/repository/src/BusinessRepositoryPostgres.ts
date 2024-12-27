import type * as s from 'zapatos/schema'

import {
	BusinessCreateSchema,
	type BusinessCreateType,
	type BusinessIdType,
	type BusinessListArgs,
	BusinessListArgsSchema,
	type BusinessRepository,
	BusinessResolvedSchema,
	BusinessSchema,
	BusinessSearchSchema,
	type BusinessSearchType,
	type BusinessType,
	newBusinessId,
} from '@i/core/business'
import {snakeCase} from 'es-toolkit'
import * as v from 'valibot'

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

		const record = await this.db.insert('businesses', toInsert).run(this.pool)

		return dbToEntity(record, BusinessSchema)
	}

	async delete(id: BusinessIdType) {
		const deleted = await this.db.deletes('businesses', {id: id.toString()}).run(this.pool)

		if (deleted.length !== 1) {
			throw new Error(`Delete error, deleted length is not 1 but ${deleted.length}`)
		}
	}

	async getById(id: BusinessIdType) {
		return this.db
			.selectOne(
				'businesses',
				{id: id.toString()},
				{
					lateral: {
						town: this.db.selectExactlyOne('uk_towns', {id: this.db.parent('town_id')}),
					},
				},
			)
			.run(this.pool)
			.then((record) => (record ? this.toResolvedBusiness(record) : null))
	}

	async list(userArgs: BusinessListArgs) {
		const args = v.parse(BusinessListArgsSchema, userArgs) as Required<BusinessListArgs>

		const records = await this.db
			.select('businesses', this.db.all, {
				lateral: {
					town: this.db.selectExactlyOne('uk_towns', {id: this.db.parent('town_id')}),
				},
				limit: args.limit,
				offset: args.offset,
				order: {
					by: snakeCase(args.order.by) as s.SQLForTable<'businesses'>,
					direction: args.order.direction,
				},
			})
			.run(this.pool)

		return records.map((r) => this.toResolvedBusiness(r))
	}

	async search(userQuery: BusinessSearchType, userArgs: BusinessListArgs = {}) {
		const query = v.parse(BusinessSearchSchema, userQuery)
		const args = v.parse(BusinessListArgsSchema, userArgs) as Required<BusinessListArgs>

		const nameWhere = query.name
			? {name: this.db.sql`LOWER(${this.db.self}) LIKE(${this.db.param(`${query.name?.toLowerCase()}%`)})`}
			: {}
		const townIdWhere = query.townId ? {town_id: this.db.sql`town_id = ${this.db.param(query.townId)}`} : {}

		const records = await this.db
			.select(
				'businesses',
				{
					...nameWhere,
					...townIdWhere,
				},
				{
					lateral: {
						town: this.db.selectExactlyOne('uk_towns', {
							id: this.db.parent('town_id'),
						}),
					},
					limit: args.limit,
					offset: args.offset,
					order: {
						by: snakeCase(args.order.by) as s.SQLForTable<'businesses'>,
						direction: args.order.direction,
					},
				},
			)
			.run(this.pool)

		return records.filter((r) => r.town !== null).map((r) => this.toResolvedBusiness(r))
	}

	async update(data: BusinessType) {
		const toUpdate = objToSnake<s.businesses.Updatable>(v.parse(BusinessSchema, data))

		const record = await this.db.update('businesses', toUpdate, {id: data.id.toString()}).run(this.pool)

		if (!record?.[0]) {
			throw new Error('Update failed, no record returned')
		}

		const town = await this.db.selectExactlyOne('uk_towns', {id: record[0].town_id}).run(this.pool)

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
