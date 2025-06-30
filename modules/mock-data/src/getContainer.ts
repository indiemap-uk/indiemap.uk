import {BusinessService} from '@i/core/business'
import {LinkService} from '@i/core/link'
import {LocationService} from '@i/core/location'
import {TownService} from '@i/core/town'
import {
  BusinessRepositoryPostgres,
  LinkRepositoryPostgres,
  LocationRepositoryPostgres,
  TownRepositoryPostgres,
  getDb,
  getPool,
} from '@i/repository'

export const getContainer = (env: {DATABASE_URL: string}) => {
  const pool = getPool(env.DATABASE_URL)

  const townRepository = new TownRepositoryPostgres(pool, getDb())
  const townService = new TownService(townRepository)

  const businessRepository = new BusinessRepositoryPostgres(pool, getDb())
  const businessService = new BusinessService(businessRepository)

  const linkRepository = new LinkRepositoryPostgres(pool, getDb())
  const linkService = new LinkService(linkRepository)

  const locationRepository = new LocationRepositoryPostgres(pool, getDb())
  const locationService = new LocationService(locationRepository)

  const end = () => pool.end()

  return {businessService, end, linkService, locationService, townService}
}
