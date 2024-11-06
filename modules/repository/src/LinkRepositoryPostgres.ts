import type {BusinessIdType} from '@i/core/business'
import type * as s from 'zapatos/schema'

import {
	LinkCreateSchema,
	type LinkCreateType,
	type LinkIdType,
	type LinkRepository,
	LinkSchema,
	type LinkType,
	newLinkId,
} from '@i/core/link'
import * as v from 'valibot'
import * as db from 'zapatos/db'

import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import {objToCamel} from './objToCamel.js'
import {objToSnake} from './objToSnake.js'

export class LinkRepositoryPostgres extends CRUDRepositoryPostgres implements LinkRepository {
	async create(data: LinkCreateType) {
		const toInsert = Object.assign({id: newLinkId()}, objToSnake<s.links.Insertable>(v.parse(LinkCreateSchema, data)))

		const record = await db.insert('links', toInsert).run(this.pool)

		return v.parse(LinkSchema, objToCamel(record))
	}

	async delete(id: LinkIdType) {
		await db.deletes('links', {id: id.toString()}).run(this.pool)
	}

	async getByBusinessId(id: BusinessIdType) {
		const records = await db
			.select('links', {business_id: id.toString()}, {order: {by: 'id', direction: 'ASC'}})
			.run(this.pool)

		return records.map(objToCamel).map((r) => v.parse(LinkSchema, r))
	}

	async update(data: LinkType): Promise<void> {
		const toUpdate = objToSnake<s.links.Updatable>(v.parse(LinkSchema, data))

		await db.update('links', toUpdate, {id: data.id.toString()}).run(this.pool)
	}
}
