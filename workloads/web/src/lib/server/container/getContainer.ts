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

import type {ContainerEnvType} from './ContainerEnvSchema'

export const getContainer = (env: ContainerEnvType) => {
	const pool = getPool(env.DATABASE_URL)

	const townRepository = new TownRepositoryPostgres(pool, getDb())
	const townService = new TownService(townRepository)

	const businessRepository = new BusinessRepositoryPostgres(pool, getDb())
	const businessService = new BusinessService(businessRepository)

	const linkRepository = new LinkRepositoryPostgres(pool, getDb())
	const linkService = new LinkService(linkRepository)

	const locationRepository = new LocationRepositoryPostgres(pool, getDb())
	const locationService = new LocationService(locationRepository)

	const geocodingService = new GeocodingServiceGeocodify(env.GEOCODIFY_API_KEY)

	return {businessService, geocodingService, linkService, locationService, townService}
}
