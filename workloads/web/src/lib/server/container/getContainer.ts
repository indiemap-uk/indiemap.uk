import { CacheMemory } from '$lib/cache/CacheMemory'
import {BusinessRepositoryPostgres, BusinessService} from '@i/core/business'
import {LinkRepositoryPostgres, LinkService} from '@i/core/link'
import {LocationRepositoryPostgres, LocationService} from '@i/core/location'
import {NoteRepositoryPostgres, NoteService} from '@i/core/note'
import {ProductRepositoryPostgres, ProductService} from '@i/core/product'
import {SourceRepositoryPostgres, SourceService} from '@i/core/source'
import {TownRepositoryPostgres, TownService} from '@i/core/town'
import { MarkdownServiceJinaAi, SummarizerServiceLLM } from '@i/core/summarizer'
import { WorkerService } from '@i/core/worker'
import pino from 'pino'
import type { ContainerEnvType } from './ContainerEnvSchema'
import {GeocodingServiceGeocodify} from "@i/core/geocoding";
import {KVStorePostgres} from "@i/core/kvStore";
import {getDb} from "@i/core/db";

export const getContainer = async (env: ContainerEnvType) => {
  const {db, pool} = getDb(env.DATABASE_URL)
  await pool.query('SET search_path TO public, authjs')

  const pinoTransports = [
    {
      level: env.LOG_LEVEL ?? 'info',
      target: 'pino-pretty',
      options: {},
    },
  ]
  if (env.AXIOM_DATASET && env.AXIOM_TOKEN) {
    pinoTransports.push({
      level: env.LOG_LEVEL ?? 'info',
      target: '@axiomhq/pino',
      options: {
        dataset: env.AXIOM_DATASET,
        token: env.AXIOM_TOKEN,
      },
    })
  }

  const logger = pino({level: env.LOG_LEVEL ?? 'info'}, pino.transport({targets: pinoTransports}))

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

  const noteRepository = new NoteRepositoryPostgres(db)
  const noteService = new NoteService(noteRepository)

  const geocodingService = new GeocodingServiceGeocodify(env.GEOCODIFY_API_KEY)

	const cache = new CacheMemory(env.CACHE_TTL)

  const kvstore = new KVStorePostgres({schema: env.KEYV_SCHEMA, table: env.KEYV_TABLE, uri: env.DATABASE_URL})
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
    logger,
    markdownService,
    noteService,
    sourceService,
    summarizerService,
    productService,
    townService,
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
		cache,
    geocodingService,
    kvstore,
    linkService,
    locationService,
    logger,
    noteRepository,
    noteService,
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
