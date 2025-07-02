import {faker} from '@faker-js/faker'
import {type TownType} from '@i/core/town'
import {TownRepositoryPostgres} from '@i/repository/TownRepositoryPostgres'
import {getDb} from '@i/repository/getDb'
import Debug from 'debug'
import {townFactory} from './townFactory.js'

const debug = Debug('indie:mock-data')

export const towns = async (count = 10) => {
  const {pool, db} = getDb(process.env.DATABASE_URL!)
  const repository = new TownRepositoryPostgres(db)

  const ids = faker.helpers.uniqueArray(() => faker.number.int({min: 5000, max: 50000}), count)

  for (let i = 0; i < count; i++) {
    debug(`Generating town ${i + 1}...`)

    const town: TownType = townFactory({id: ids[i] as number})

    await repository.create(town)
  }

  await pool.end()

  debug(`Done`)
}

// Run this as a CLI if invoked directly with `tsx`
if (import.meta.url === `file://${process.argv[1]}`) {
  towns().catch(console.error)
}
