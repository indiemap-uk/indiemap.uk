import {BusinessService} from '@i/core/business'
import {LinkService} from '@i/core/link'
import {LocationService} from '@i/core/location'
import {ProductService} from '@i/core/product'
import {SourceService} from '@i/core/source'
import {TownService} from '@i/core/town'
import {GeocodingServiceGeocodify} from '@i/geocoding'
import {BusinessRepositoryPostgres} from '@i/repository/BusinessRepositoryPostgres'
import {KVPostgresStore} from '@i/repository/KVPostgresStore'
import {LinkRepositoryPostgres} from '@i/repository/LinkRepositoryPostgres'
import {LocationRepositoryPostgres} from '@i/repository/LocationRepositoryPostgres'
import {ProductRepositoryPostgres} from '@i/repository/ProductRepositoryPostgres'
import {SourceRepositoryPostgres} from '@i/repository/SourceRepositoryPostgres'
import {TownRepositoryPostgres} from '@i/repository/TownRepositoryPostgres'
import {getDb} from '@i/repository/getDb'
import {MarkdownServiceJinaAi} from '@i/summarizer/MarkdownServiceJinaAi'
import {SummarizerServiceLLM} from '@i/summarizer/SummarizerServiceLLM'
import {WorkerService} from '@i/worker/WorkerService'
import pino from 'pino'
import type {ContainerEnvType} from './ContainerEnvSchema'

export const getContainer = async (env: ContainerEnvType) => {
  const {db, pool} = getDb(env.DATABASE_URL)
  await pool.query('SET search_path TO public, authjs')

  const logger = pino()

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

  const geocodingService = new GeocodingServiceGeocodify(env.GEOCODIFY_API_KEY)

  const kvstore = new KVPostgresStore({schema: env.KEYV_SCHEMA, table: env.KEYV_TABLE, uri: env.DATABASE_URL})
  await kvstore.init()
  const markdownService = new MarkdownServiceJinaAi(env.JINA_API_KEY)
  const openAiApiKey = env.OPENAI_API_KEY
  const summarizerService = new SummarizerServiceLLM(openAiApiKey)

  const sourceRepository = new SourceRepositoryPostgres(db)
  const sourceService = new SourceService(sourceRepository)

  const workerService = new WorkerService({DATABASE_URL: env.DATABASE_URL}, {
    businessService,
    kvstore,
    linkService,
    markdownService,
    sourceService,
    summarizerService,
    productService,
  })
  await workerService.start()

  process.on('sveltekit:shutdown', async (reason) => {
    console.info('SvelteKit has shutdown because of', reason)

    console.info('Stopping Graphile Worker...')
    await workerService.stop()

    console.info('Closing database connection...')
    await pool.end()
  })

  return {
    businessRepository,
    businessService,
    geocodingService,
    kvstore,
    linkService,
    locationService,
    logger,
    sourceRepository,
    sourceService,
    summarizerService,
    townRepository,
    townService,
    workerService,
    productRepository,
    productService,
  }
}
