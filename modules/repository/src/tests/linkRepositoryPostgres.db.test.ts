import {describe, expect, test} from 'vitest'
import {getPool} from '../getPool.js'
import {LinkRepositoryPostgres} from '../LinkRepositoryPostgres.js'
import {LinkCreateType} from '@i/core/link'
import {BusinessRepositoryPostgres} from '../BusinessRepositoryPostgres.js'
import type {BusinessCreateType} from '@i/core/business'
import {TownRepositoryPostgres} from '../TownRepositoryPostgres.js'
import {runner as migrationRunner} from 'node-pg-migrate'
import {PostgreSqlContainer} from '@testcontainers/postgresql'
import {insertTestTowns} from './insertTestTowns.js'

describe('link Repository Postgres', () => {
	test(`insert`, async () => {
		const container = await new PostgreSqlContainer().start()
		const databaseUrl = container.getConnectionUri()

		await migrationRunner({
			databaseUrl,
			migrationsTable: 'pgmigrations',
			dir: 'migrations',
			direction: 'up',
		})

		const pool = getPool(databaseUrl)
		const townRepository = new TownRepositoryPostgres(pool)
		const linkRepository = new LinkRepositoryPostgres(pool)
		const businessRepository = new BusinessRepositoryPostgres(pool)

		await insertTestTowns(pool)
		const town = await townRepository.getRandom()

		const newBusiness: BusinessCreateType = {
			description: 'description',
			name: 'name',
			townId: town.id,
		}

		const business = await businessRepository.create(newBusiness)

		const newLink: LinkCreateType = {
			url: 'https://www.example.com',
			label: 'example',
			businessId: business.id,
		}

		const linkFromDb = await linkRepository.create(newLink)

		expect(linkFromDb.id).toBeDefined()
	}, 9999)
})
