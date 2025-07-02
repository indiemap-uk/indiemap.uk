import type {BusinessType} from '@i/core/business'
import type {LinkType} from '@i/core/link'
import type {TownType} from '@i/core/town'
import {PostgreSqlContainer, StartedPostgreSqlContainer} from '@testcontainers/postgresql'
import {migrate} from 'drizzle-orm/node-postgres/migrator'
import type {PostgresJsDatabase} from 'drizzle-orm/postgres-js'
import type {Pool} from 'pg'
import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import {BusinessRepositoryPostgres} from './BusinessRepositoryPostgres.js'
import {LinkRepositoryPostgres} from './LinkRepositoryPostgres.js'
import {TownRepositoryPostgres} from './TownRepositoryPostgres.js'
import {getDb} from './getDb.js'
import {businessFactory} from './mock-data/businessFactory.js'
import {linkFactory} from './mock-data/linkFactory.js'
import {townFactory} from './mock-data/townFactory.js'

describe('Link Repository Postgres', () => {
  let container: StartedPostgreSqlContainer
  let db: PostgresJsDatabase
  let pool: Pool
  let linkRepository: LinkRepositoryPostgres
  let links: LinkType[]
  let businessRepository: BusinessRepositoryPostgres
  let business: BusinessType
  let townRepository: TownRepositoryPostgres
  let town: TownType

  const linkCount = 2

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:15-alpine').start()

    const dbConnection = getDb(container.getConnectionUri())
    db = dbConnection.db
    pool = dbConnection.pool

    await migrate(db, {migrationsFolder: './drizzle'})
    linkRepository = new LinkRepositoryPostgres(db)
    businessRepository = new BusinessRepositoryPostgres(db)
    townRepository = new TownRepositoryPostgres(db)

    town = await townRepository.create(townFactory())
    business = await businessRepository.create(businessFactory({townId: town.id}))
    const linkMocks = Array.from({length: linkCount}, () => linkFactory({businessId: business.id}))
    links = await Promise.all(linkMocks.map(link => linkRepository.create(link)))
  }, 60_000)

  afterAll(async () => {
    pool && await pool.end()
    container && await container.stop()
  })

  test('get links by business id', async () => {
    const found = await linkRepository.getByBusinessId(business.id)

    expect(found).toHaveLength(linkCount)
    found.forEach(link => {
      expect(link.businessId).toBe(business.id)
    })
  })

  test('get links by business id returns empty array for non-existent business', async () => {
    const found = await linkRepository.getByBusinessId('bsn_nonexistent123456789' as any)

    expect(found).toEqual([])
  })

  test('update link', async () => {
    const link = links[0]!
    const updatedData: LinkType = {
      ...link,
      label: 'Updated Test Website',
      url: 'https://updated-test-website.com',
    }

    await linkRepository.update(updatedData)

    // Verify the update by fetching all links for the business
    const businessLinks = await linkRepository.getByBusinessId(business.id)
    const updatedLink = businessLinks.find(l => l.id === link.id)

    expect(updatedLink).toBeDefined()
    expect(updatedLink!.label).toBe('Updated Test Website')
    expect(updatedLink!.url).toBe('https://updated-test-website.com')
    expect(updatedLink!.businessId).toBe(link.businessId)
  })

  test('delete link', async () => {
    // Create a link specifically for deletion
    const linkData = linkFactory({businessId: business.id})
    const {id, ...linkToDelete} = linkData
    const created = await linkRepository.create(linkToDelete)

    // Verify it exists
    const beforeDelete = await linkRepository.getByBusinessId(business.id)
    const existingLink = beforeDelete.find(l => l.id === created.id)
    expect(existingLink).toBeDefined()

    // Delete it
    await linkRepository.delete(created.id)

    // Verify it's gone
    const afterDelete = await linkRepository.getByBusinessId(business.id)
    const deletedLink = afterDelete.find(l => l.id === created.id)
    expect(deletedLink).toBeUndefined()
  })

  test('create link validates URL format', async () => {
    const linkData = linkFactory({
      businessId: business.id,
      url: 'not-a-valid-url',
    })
    const {id, ...invalidLink} = linkData

    await expect(linkRepository.create(invalidLink)).rejects.toThrow()
  })

  test('create link validates URL length', async () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(250)
    const linkData = linkFactory({
      businessId: business.id,
      url: longUrl,
    })
    const {id, ...invalidLink} = linkData

    await expect(linkRepository.create(invalidLink)).rejects.toThrow()
  })

  test('create link trims whitespace from URL and label', async () => {
    const linkData = linkFactory({
      businessId: business.id,
      label: '  Whitespace Label  ',
      url: '  https://whitespace-url.com  ',
    })
    const {id, ...newLink} = linkData

    const created = await linkRepository.create(newLink)

    expect(created.label).toBe('Whitespace Label')
    expect(created.url).toBe('https://whitespace-url.com')
  })
})
