import {BusinessService} from '@i/core/business'
import {LinkService} from '@i/core/link'
import {LocationService} from '@i/core/location'
import {TownService} from '@i/core/town'
import {GeocodingServiceGeocodify} from '@i/geocoding'
import {KVPostgresStore} from '@i/repository/KVPostgresStore'
import {MarkdownServiceJinaAi} from '@i/summarizer/MarkdownServiceJinaAi'
import {SummarizerService} from '@i/summarizer/SummarizerService'

import {BusinessRepositoryPostgres} from '@i/repository/BusinessRepositoryPostgres'
import {LinkRepositoryPostgres} from '@i/repository/LinkRepositoryPostgres'
import {LocationRepositoryPostgres} from '@i/repository/LocationRepositoryPostgres'
import {TownRepositoryPostgres} from '@i/repository/TownRepositoryPostgres'
import {getDb} from '@i/repository/getDb'
import type {ContainerEnvType} from './ContainerEnvSchema'

export const getContainer = async (env: ContainerEnvType) => {
  const {db, pool} = getDb(env.DATABASE_URL)
  await pool.query('SET search_path TO public, authjs')

  const townRepository = new TownRepositoryPostgres(db)
  const townService = new TownService(townRepository)

  const businessRepository = new BusinessRepositoryPostgres(db)
  const businessService = new BusinessService(businessRepository)

  const linkRepository = new LinkRepositoryPostgres(db)
  const linkService = new LinkService(linkRepository)

  const locationRepository = new LocationRepositoryPostgres(db)
  const locationService = new LocationService(locationRepository)

  const geocodingService = new GeocodingServiceGeocodify(env.GEOCODIFY_API_KEY)

  const kvstore = new KVPostgresStore({schema: env.KEYV_SCHEMA, table: env.KEYV_TABLE, uri: env.DATABASE_URL})
  const markdownService = new MarkdownServiceJinaAi(env.JINA_API_KEY)
  const openAiApiKey = env.OPENAI_API_KEY
  const summarizerService = new SummarizerService(kvstore, markdownService, openAiApiKey)

  return {businessService, geocodingService, kvstore, linkService, locationService, summarizerService, townService}
}
