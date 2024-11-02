import type * as s from 'zapatos/schema'

import {LinkCreateSchema, type LinkCreateType, type LinkRepository, LinkSchema, newLinkId} from '@i/core/link'
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
}
