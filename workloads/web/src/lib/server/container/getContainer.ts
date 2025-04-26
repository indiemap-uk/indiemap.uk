import {BusinessService} from '@i/core/business'
import {LinkService} from '@i/core/link'
import {LocationService} from '@i/core/location'
import {TownService} from '@i/core/town'
import {GeocodingServiceGeocodify} from '@i/geocoding'
import {
	BusinessRepositoryPostgres,
	getDb,
	getPool,
	LinkRepositoryPostgres,
	LocationRepositoryPostgres,
	TownRepositoryPostgres,
} from '@i/repository'
import {KVPostgresStore} from '@i/summarizer/KVPostgresStore'
import {MarkdownServiceJinaAi} from '@i/summarizer/MarkdownServiceJinaAi'
import {SummarizerService} from '@i/summarizer/SummarizerService'

import type {ContainerEnvType} from './ContainerEnvSchema'

export const getContainer = async (env: ContainerEnvType) => {
	const pool = getPool(env.DATABASE_URL)
	await pool.query('SET search_path TO public, authjs')

	const townRepository = new TownRepositoryPostgres(pool, getDb())
	const townService = new TownService(townRepository)

	const businessRepository = new BusinessRepositoryPostgres(pool, getDb())
	const businessService = new BusinessService(businessRepository)

	const linkRepository = new LinkRepositoryPostgres(pool, getDb())
	const linkService = new LinkService(linkRepository)

	const locationRepository = new LocationRepositoryPostgres(pool, getDb())
	const locationService = new LocationService(locationRepository)

	const geocodingService = new GeocodingServiceGeocodify(env.GEOCODIFY_API_KEY)

	const kvstore = new KVPostgresStore({schema: env.KEYV_SCHEMA, table: env.KEYV_TABLE, uri: env.DATABASE_URL})
	const markdownService = new MarkdownServiceJinaAi(env.JINA_API_KEY)
	const openAiApiKey = env.OPENAI_API_KEY
	const summarizerService = new SummarizerService(kvstore, markdownService, openAiApiKey)

	return {businessService, geocodingService, linkService, locationService, summarizerService, townService}
}
