import type {CRUDRepository} from '@i/core/repository'
import type * as s from 'zapatos/schema'

import {BusinessCreateSchema, type BusinessCreateType, BusinessSchema, type BusinessType} from '@i/core/business'
import * as v from 'valibot'
import * as db from 'zapatos/db'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {objToCamel} from './objToCamel.js'
import {objToSnake} from './objToSnake.js'

export class BusinessRepositoryPostgres extends CRUDRepositoryPostgres implements CRUDRepository<BusinessType> {
	async create(data: BusinessCreateType) {
		const toInsert = objToSnake<s.businesses.Insertable>(v.parse(BusinessCreateSchema, data))

		const record = await db.insert('businesses', toInsert).run(this.pool)
		const entity = Object.assign({}, {links: []}, objToCamel(record))

		return v.parse(BusinessSchema, entity)
	}
}
