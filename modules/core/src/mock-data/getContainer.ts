import {BusinessRepositoryPostgres} from '#business/BusinessRepositoryPostgres.js'
import {BusinessService} from '#business/index.js'
import {getDb} from '#db/getDb.js'
import {LinkRepositoryPostgres} from '#link/LinkRepositoryPostgres.js'
import {LinkService} from '#link/index.js'
import {LocationRepositoryPostgres} from '#location/LocationRepositoryPostgres.js'
import {LocationService} from '#location/index.js'
import {ProductRepositoryPostgres} from '#product/ProductRepositoryPostgres.js'
import {ProductService} from '#product/index.js'
import {TownRepositoryPostgres} from '#town/TownRepositoryPostgres.js'
import {TownService} from '#town/index.js'

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

  const productRepository = new ProductRepositoryPostgres(db)
  const productService = new ProductService(productRepository)

  const end = () => pool.end()

  return {businessService, end, linkService, locationService, productService, townService}
}
