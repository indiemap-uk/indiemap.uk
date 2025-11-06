import type {IndieDBType} from '#db/CRUDRepositoryPostgres.js'
import {getDb} from '#db/getDb.js'
import {businessFactory} from '#mock/businessFactory.js'
import {townFactory} from '#mock/townFactory.js'
import {TownRepositoryPostgres} from '#town/TownRepositoryPostgres.js'
import {PostgreSqlContainer, StartedPostgreSqlContainer} from '@testcontainers/postgresql'
import {migrate} from 'drizzle-orm/node-postgres/migrator'
import type {Pool} from 'pg'
import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import {BusinessRepositoryPostgres} from './BusinessRepositoryPostgres.js'
import {newBusinessId} from './BusinessSchema.js'
import type {BusinessType} from './BusinessType.js'

describe('Business Repository Postgres @db', () => {
  let container: StartedPostgreSqlContainer
  let db: IndieDBType
  let pool: Pool
  let repository: BusinessRepositoryPostgres
  let townRepository: TownRepositoryPostgres
  let businesses: BusinessType[]
  let testTown: any

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:15-alpine').start()

    const dbConnection = getDb(container.getConnectionUri())
    db = dbConnection.db
    pool = dbConnection.pool

    await migrate(db, {migrationsFolder: './drizzle'})
    repository = new BusinessRepositoryPostgres(db)
    townRepository = new TownRepositoryPostgres(db)

    // Create a town first for business references
    testTown = townFactory()
    await townRepository.create(testTown)

    businesses = Array.from({length: 5}, (_, i) => {
      const seed = i === 0 ? {name: 'Test Business'} : {}
      return businessFactory({...seed, townId: testTown.id})
    })

    businesses = await Promise.all(businesses.map(business => repository.create(business)))
  }, 60_000)

  afterAll(async () => {
    pool && await pool.end()
    container && await container.stop()
  })

  describe(`get by id`, () => {
    test('get by id', async () => {
      const business = businesses[0]!
      const found = await repository.getById(business.id)

      expect(found?.id).toBe(business.id)
      expect(found?.name).toBe(business.name)
      expect(found?.town).toBeDefined()
      expect(found?.town?.id).toBe(testTown.id)
    })

    test('get by id with status filter', async () => {
      const liveBusiness = businesses.find(b => b.status === 'live')!
      const found = await repository.getById(liveBusiness.id, 'live')

      expect(found?.id).toBe(liveBusiness.id)
      expect(found?.status).toBe('live')
    })

    test('get by id with non-matching status filter returns null', async () => {
      const liveBusiness = businesses.find(b => b.status === 'live')!
      const found = await repository.getById(liveBusiness.id, 'draft')

      expect(found).toBeNull()
    })

    test('get by id returns null for non-existent business', async () => {
      const found = await repository.getById('bsn_nonexistent123456789' as any)

      expect(found).toBeNull()
    })
  })

  describe(`search`, () => {
    test('search by name', async () => {
      const found = await repository.search({name: 'Test Business'})

      expect(found).toHaveLength(1)
      expect(found[0]?.name).toBe('Test Business')
      expect(found[0]?.town).toBeDefined()
    })

    test('search by status', async () => {
      const found = await repository.search({status: 'live'})

      expect(found.length).toBeGreaterThan(0)
      found.forEach(business => {
        expect(business.status).toBe('live')
      })
    })

    test('search by townId', async () => {
      const found = await repository.search({townId: testTown.id})

      expect(found.length).toBe(businesses.length)
      found.forEach(business => {
        expect(business.townId).toBe(testTown.id)
      })
    })

    test('search with multiple filters', async () => {
      const found = await repository.search({
        name: 'Test',
        status: 'live',
        townId: testTown.id,
      })

      found.forEach(business => {
        expect(business.name.toLowerCase()).toContain('test')
        expect(business.status).toBe('live')
        expect(business.townId).toBe(testTown.id)
      })
    })

    test('search with pagination', async () => {
      const firstPage = await repository.search({}, {limit: 2, offset: 0})
      const secondPage = await repository.search({}, {limit: 2, offset: 2})

      expect(firstPage).toHaveLength(2)
      expect(secondPage).toHaveLength(2)
      expect(firstPage[0]?.id).not.toBe(secondPage[0]?.id)
    })

    test('search with ordering by name DESC', async () => {
      const found = await repository.search({}, {
        order: {by: 'name', direction: 'DESC'},
      })

      expect(found.length).toBeGreaterThan(1)
      for (let i = 1; i < found.length; i++) {
        expect(found[i - 1]!.name.localeCompare(found[i]!.name)).toBeGreaterThanOrEqual(0)
      }
    })

    test('search with ordering by createdAt ASC', async () => {
      const found = await repository.search({}, {
        order: {by: 'createdAt', direction: 'ASC'},
      })

      expect(found.length).toBeGreaterThan(1)
      for (let i = 1; i < found.length; i++) {
        expect(new Date(found[i - 1]!.createdAt).getTime()).toBeLessThanOrEqual(
          new Date(found[i]!.createdAt).getTime(),
        )
      }
    })
  })

  describe(`update`, () => {
    test('update business', async () => {
      const business = businesses[0]!
      const updatedData: BusinessType = {
        ...business,
        name: 'Updated Business Name',
        description: 'Updated description',
        status: 'draft',
      }

      const updated = await repository.update(updatedData)

      expect(updated.id).toBe(business.id)
      expect(updated.name).toBe('Updated Business Name')
      expect(updated.description).toBe('Updated description')
      expect(updated.status).toBe('draft')
      expect(updated.town).toBeDefined()
    })

    test('updatedAt is set', async () => {
      const original = businesses[1]!

      await repository.update({
        ...original,
        name: 'Business 2 Hello',
      })

      const updated = await repository.getById(original.id)
      expect(updated!.updatedAt).not.toEqual(original.updatedAt)
    })

    test('update business with different townId', async () => {
      // Create another town
      const newTown = townFactory()
      await townRepository.create(newTown)

      const business = businesses[1]!
      const updatedData: BusinessType = {
        ...business,
        townId: newTown.id,
        updatedAt: new Date().toISOString(),
      }

      const updated = await repository.update(updatedData)

      expect(updated.townId).toBe(newTown.id)
      expect(updated.town?.id).toBe(newTown.id)
    })

    test('update business with null townId', async () => {
      const business = businesses[2]!
      const updatedData: BusinessType = {
        ...business,
        townId: null,
        updatedAt: new Date().toISOString(),
      }

      const updated = await repository.update(updatedData)

      expect(updated.townId).toBeFalsy()
      expect(updated.town).toBeFalsy()
    })

    test('update non-existent business throws error', async () => {
      const nonExistentBusiness: BusinessType = {
        ...businesses[0]!,
        id: newBusinessId(),
        updatedAt: new Date().toISOString(),
      }

      await expect(repository.update(nonExistentBusiness)).rejects.toThrow(/Business with id .* not found/)
    })
  })

  test('delete business', async () => {
    // Create a business specifically for deletion
    const businessToDelete = businessFactory({townId: testTown.id})
    const created = await repository.create(businessToDelete)

    // Verify it exists
    const beforeDelete = await repository.getById(created.id)
    expect(beforeDelete).not.toBeNull()

    // Delete it
    await repository.delete(created.id)

    // Verify it's gone
    const afterDelete = await repository.getById(created.id)
    expect(afterDelete).toBeNull()
  })
})
