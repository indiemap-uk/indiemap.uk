import type {BusinessIdType} from '@i/core/business'
import type {Pool} from 'pg'
import type {SnakeCasedProperties} from 'type-fest'
import type * as s from 'zapatos/schema'

import {
	type LocationCreateType,
	type LocationIdType,
	type LocationRepository,
	LocationSchema,
	type LocationType,
	newLocationId,
} from '@i/core/location'
import Big from 'big.js'
import Debug from 'debug'
import {omit} from 'es-toolkit'
import * as v from 'valibot'
import * as zdb from 'zapatos/db'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {objToCamel} from './objToCamel.js'
import {objToSnake} from './objToSnake.js'

const LocationDBSchema = v.pipe(
	LocationSchema,
	v.transform((input) => objToSnake<SnakeCasedProperties<LocationType>>(input)),
	v.transform((input) => omit({...input, id: input.id.toString()}, ['business_id'])),
)

export class LocationRepositoryPostgres extends CRUDRepositoryPostgres implements LocationRepository {
	debug: debug.Debugger

	constructor(pool: Pool, db: typeof zdb) {
		super(pool, db)
		this.debug = Debug('indie:reop:LocationPostgres')
	}

	async create(data: LocationCreateType) {
		const toInsert: s.locations.Insertable = {
			address: data.address,
			id: newLocationId(),
			label: data.label ?? '',
			latitude: data.latitude,
			longitude: data.longitude,
		}

		return this.db.readCommitted<LocationType>(this.pool, async (txnClient) => {
			const record = await this.db.insert('locations', toInsert).run(txnClient)

			await this.db
				.insert('business_locations', {
					business_id: data.businessId.toString(),
					location_id: record.id,
				})
				.run(txnClient)

			return v.parse(
				LocationSchema,
				objToCamel({
					...record,
					businessId: data.businessId,
				}),
			)
		})
	}

	async delete(id: LocationIdType) {
		await this.db.deletes('locations', {id: id.toString()}).run(this.pool)
	}

	async getByBusinessId(id: BusinessIdType) {
		type SQL = s.business_locations.SQL | s.locations.SQL
		type Selectable = s.business_locations.Selectable & s.locations.Selectable
		const records = await this.db.sql<SQL, Selectable[]>`SELECT 
			l.address, bl.business_id, l.id, l."label", l.latitude, l.longitude
			FROM ${'locations'} l
			INNER JOIN ${'business_locations'} bl
			ON l.id = bl.location_id
			WHERE bl.business_id = ${this.db.param(id)}`.run(this.pool)

		return records
			.map((r) => ({
				...r,
				latitude: new Big(r.latitude ?? 0).toNumber(),
				longitude: new Big(r.longitude ?? 0).toNumber(),
			}))
			.map(objToCamel)
			.map((r) => v.parse(LocationSchema, r))
	}

	async update(data: LocationType) {
		const toUpdate = v.parse(LocationDBSchema, data)
		console.log('toUpdate in LocationRepositoryPostgres.ts', toUpdate)

		await this.db.update('locations', toUpdate, {id: data.id.toString()}).run(this.pool)

		return data
	}
}
