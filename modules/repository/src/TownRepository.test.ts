import type {TownType} from '@i/core/town'
import {PostgreSqlContainer, StartedPostgreSqlContainer} from '@testcontainers/postgresql'
import {migrate} from 'drizzle-orm/node-postgres/migrator'
import type {Pool} from 'pg'
import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import {BusinessRepositoryPostgres} from './BusinessRepositoryPostgres.js'
import type {IndieDBType} from './CRUDRepositoryPostgres.js'
import {TownRepositoryPostgres} from './TownRepositoryPostgres.js'
import {getDb} from './getDb.js'
import {businessFactory} from './mock-data/businessFactory.js'
import {townFactory} from './mock-data/townFactory.js'

describe('Town Repository Postgres @db', () => {
  let container: StartedPostgreSqlContainer
  let db: IndieDBType
  let pool: Pool
  let townRepository: TownRepositoryPostgres
  let businessRepository: BusinessRepositoryPostgres
  let towns: TownType[]

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:15-alpine').start()

    const dbConnection = getDb(container.getConnectionUri())
    db = dbConnection.db
    pool = dbConnection.pool

    await migrate(db, {migrationsFolder: './drizzle'})
    townRepository = new TownRepositoryPostgres(db)
    businessRepository = new BusinessRepositoryPostgres(db)

    towns = Array.from({length: 10}, (_, i) => {
      const seed = i === 0 ? {name: '1st Town!'} : {}

      return townFactory(seed)
    })
    await Promise.all(towns.map(town => townRepository.create(town)))
  }, 60_000)

  afterAll(async () => {
    pool && await pool.end()
    container && await container.stop()
  })

  test('get by id', async () => {
    const town = towns[0]!
    const found = await townRepository.getById(town.id)

    expect(found?.id).toBe(town.id)
    expect(found?.name).toBe(town.name)
  })

  test('get random', async () => {
    const found = await townRepository.getRandom()

    expect(found).toBeDefined()
    expect(towns.map(t => t.id)).toContain(found.id)
  })

  test('get randoms', async () => {
    const ids = towns.map(t => t.id)

    const found = await townRepository.getRandoms(3)

    expect(found).toHaveLength(3)
    expect(ids).toContain(found[0]?.id)
    expect(ids).toContain(found[1]?.id)
    expect(ids).toContain(found[2]?.id)
  })

  test('search by name only', async () => {
    const found = await townRepository.search({q: '1st'})

    expect(found).toHaveLength(1)
    expect(found[0]?.name).toBe('1st Town!')
  })

  test('search by name and hasBusiness', async () => {
    const town = towns[1]!
    const business = businessFactory({townId: town.id})
    await businessRepository.create(business)

    const foundWith = await townRepository.search({q: town.name, hasBusiness: true})

    expect(foundWith).toHaveLength(1)
    expect(foundWith[0]?.name).toBe(town.name)
  })

  test('the decimals latitude and longitude are stored correctly', async () => {
    const original = townFactory({
      latitude: 51.77815,
      longitude: -3.22276,
    })

    await townRepository.create(original)

    const found = await townRepository.getById(original.id)

    expect(found?.latitude).toBe(original.latitude)
    expect(found?.longitude).toBe(original.longitude)
  })
})
