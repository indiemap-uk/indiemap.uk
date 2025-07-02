import {BusinessService} from '@i/core/business'
import {LinkService} from '@i/core/link'
import {LocationService} from '@i/core/location'
import {TownService} from '@i/core/town'
import {BusinessRepositoryPostgres} from '../BusinessRepositoryPostgres.js'
import {LinkRepositoryPostgres} from '../LinkRepositoryPostgres.js'
import {LocationRepositoryPostgres} from '../LocationRepositoryPostgres.js'
import {TownRepositoryPostgres} from '../TownRepositoryPostgres.js'
import {getDb} from '../getDb.js'

export const getContainer = (env: {DATABASE_URL: string}) => {
  const {db, pool} = getDb(env.DATABASE_URL)

  const townRepository = new TownRepositoryPostgres(db)
  const townService = new TownService(townRepository)

  const businessRepository = new BusinessRepositoryPostgres(db)
  const businessService = new BusinessService(businessRepository)

  const linkRepository = new LinkRepositoryPostgres(db)
  const linkService = new LinkService(linkRepository)

  const locationRepository = new LocationRepositoryPostgres(db)
  const locationService = new LocationService(locationRepository)

  const end = () => pool.end()

  return {businessService, end, linkService, locationService, townService}
}
