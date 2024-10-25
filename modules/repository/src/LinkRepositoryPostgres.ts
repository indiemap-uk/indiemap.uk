import {LinkCreateSchema, type LinkCreateType, LinkSchema, type LinkType} from '@i/core/link'
import type {CRUDRepository} from '@i/core/repository'
import * as db from 'zapatos/db'
import {CRUDRepositoryPostgres} from './CRUDRepositoryPostgres.js'
import * as v from 'valibot'
import {objToSnake} from './objToSnake.js'
import type * as s from 'zapatos/schema'
import {objToCamel} from './objToCamel.js'

export class LinkRepositoryPostgres extends CRUDRepositoryPostgres implements CRUDRepository<LinkType> {
	async create(data: LinkCreateType) {
		const toInsert = objToSnake<s.links.Insertable>(v.parse(LinkCreateSchema, data))

		const record = await db.insert('links', toInsert).run(this.pool)

		return v.parse(LinkSchema, objToCamel(record))
	}
}
