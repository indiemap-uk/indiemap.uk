import type {BusinessCreateType} from '@i/core/business'
import type {LinkCreateType} from '@i/core/link'

import {PostgreSqlContainer} from '@testcontainers/postgresql'
import {runner as migrationRunner} from 'node-pg-migrate'
import {describe, expect, test} from 'vitest'

import {BusinessRepositoryPostgres} from '../BusinessRepositoryPostgres.js'
import {getDb} from '../getDb.js'
import {getPool} from '../getPool.js'
import {LinkRepositoryPostgres} from '../LinkRepositoryPostgres.js'
import {TownRepositoryPostgres} from '../TownRepositoryPostgres.js'
import {insertTestTowns} from './insertTestTowns.js'

/** WARNING: This test does not work with OrbStack */
describe('link Repository Postgres', () => {
	test(`insert`, async () => {
		const container = await new PostgreSqlContainer().start()
		const databaseUrl = container.getConnectionUri()

		await migrationRunner({
			databaseUrl,
			dir: 'migrations',
			direction: 'up',
			migrationsTable: 'pgmigrations',
		})

		const pool = getPool(databaseUrl)
		const townRepository = new TownRepositoryPostgres(pool, getDb())
		const linkRepository = new LinkRepositoryPostgres(pool, getDb())
		const businessRepository = new BusinessRepositoryPostgres(pool, getDb())

		await insertTestTowns(pool)
		const town = await townRepository.getRandom()

		const newBusiness: BusinessCreateType = {
			createdAt: new Date().toISOString(),
			description: 'description',
			name: 'name',
			townId: town.id,
			updatedAt: new Date().toISOString(),
		}

		const business = await businessRepository.create(newBusiness)

		const newLink: LinkCreateType = {
			businessId: business.id,
			label: 'example',
			url: 'https://www.example.com',
		}

		const linkFromDb = await linkRepository.create(newLink)

		expect(linkFromDb.id).toBeDefined()
	}, 9999)
})
