import type {BusinessType} from '@i/core/business'
import type {LocationType} from '@i/core/location'
import type {TownType} from '@i/core/town'
import {PostgreSqlContainer, StartedPostgreSqlContainer} from '@testcontainers/postgresql'
import {migrate} from 'drizzle-orm/node-postgres/migrator'
import type {Pool} from 'pg'
import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import {BusinessRepositoryPostgres} from './BusinessRepositoryPostgres.js'
import type {IndieDBType} from './CRUDRepositoryPostgres.js'
import {LocationRepositoryPostgres} from './LocationRepositoryPostgres.js'
import {TownRepositoryPostgres} from './TownRepositoryPostgres.js'
import {getDb} from './getDb.js'
import {businessFactory} from './mock-data/businessFactory.js'
import {locationFactory} from './mock-data/locationFactory.js'
import {townFactory} from './mock-data/townFactory.js'

describe('Location Repository Postgres @db', () => {
  let container: StartedPostgreSqlContainer
  let db: IndieDBType
  let pool: Pool
  let locationRepository: LocationRepositoryPostgres
  let locations: LocationType[]
  let businessRepository: BusinessRepositoryPostgres
  let business: BusinessType
  let townRepository: TownRepositoryPostgres
  let town: TownType

  const locationCount = 2

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:15-alpine').start()

    const dbConnection = getDb(container.getConnectionUri())
    db = dbConnection.db
    pool = dbConnection.pool

    await migrate(db, {migrationsFolder: './drizzle'})
    locationRepository = new LocationRepositoryPostgres(db)
    businessRepository = new BusinessRepositoryPostgres(db)
    townRepository = new TownRepositoryPostgres(db)

    town = await townRepository.create(townFactory())
    business = await businessRepository.create(businessFactory({townId: town.id}))
    const locationMocks = Array.from({length: locationCount}, () => locationFactory({businessId: business.id}))
    locations = await Promise.all(locationMocks.map(location => locationRepository.create(location)))
  }, 60_000)

  afterAll(async () => {
    pool && await pool.end()
    container && await container.stop()
  })

  test('get locations by business id', async () => {
    const found = await locationRepository.getByBusinessId(business.id)

    expect(found).toHaveLength(locationCount)
    found.forEach(location => {
      expect(location.businessId).toBe(business.id)
    })
  })

  test('get locations by business id returns empty array for non-existent business', async () => {
    const found = await locationRepository.getByBusinessId('bsn_nonexistent123456789' as any)

    expect(found).toEqual([])
  })

  test('update location', async () => {
    const location = locations[0]!
    const updatedData: LocationType = {
      ...location,
      address: '123 Updated Street, Updated City',
      label: 'Updated Location',
      latitude: 51.5074,
      longitude: -0.1278,
    }

    await locationRepository.update(updatedData)

    // Verify the update by fetching all locations for the business
    const businessLocations = await locationRepository.getByBusinessId(business.id)
    const updatedLocation = businessLocations.find(l => l.id === location.id)

    expect(updatedLocation).toBeDefined()
    expect(updatedLocation!.address).toBe('123 Updated Street, Updated City')
    expect(updatedLocation!.label).toBe('Updated Location')
    expect(updatedLocation!.latitude).toBe(51.5074)
    expect(updatedLocation!.longitude).toBe(-0.1278)
    expect(updatedLocation!.businessId).toBe(location.businessId)
  })

  test('delete location', async () => {
    // Create a location specifically for deletion
    const locationData = locationFactory({businessId: business.id})
    const created = await locationRepository.create(locationData)

    // Verify it exists
    const beforeDelete = await locationRepository.getByBusinessId(business.id)
    const existingLocation = beforeDelete.find(l => l.id === created.id)
    expect(existingLocation).toBeDefined()

    // Delete it
    await locationRepository.delete(created.id)

    // Verify it's gone
    const afterDelete = await locationRepository.getByBusinessId(business.id)
    const deletedLocation = afterDelete.find(l => l.id === created.id)
    expect(deletedLocation).toBeUndefined()
  })

  test('create location validates address length', async () => {
    const longAddress = 'a'.repeat(500)
    const locationData = locationFactory({
      businessId: business.id,
      address: longAddress,
    })
    const {id, ...invalidLocation} = locationData

    await expect(locationRepository.create(invalidLocation)).rejects.toThrow()
  })

  test('create location validates latitude range', async () => {
    const locationData = locationFactory({
      businessId: business.id,
      latitude: 91, // Invalid latitude (should be -90 to 90)
    })
    const {id, ...invalidLocation} = locationData

    await expect(locationRepository.create(invalidLocation)).rejects.toThrow()
  })

  test('create location validates longitude range', async () => {
    const locationData = locationFactory({
      businessId: business.id,
      longitude: 181, // Invalid longitude (should be -180 to 180)
    })
    const {id, ...invalidLocation} = locationData

    await expect(locationRepository.create(invalidLocation)).rejects.toThrow()
  })
})
