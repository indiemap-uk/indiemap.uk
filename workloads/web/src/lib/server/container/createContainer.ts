import {BusinessService} from '@i/core/business'
import {LinkService} from '@i/core/link'
import {TownService} from '@i/core/town'
import {BusinessRepositoryPostgres, getDb, getPool, LinkRepositoryPostgres, TownRepositoryPostgres} from '@i/repository'

import type {ContainerEnvType} from './ContainerEnvSchema'

export const createContainer = (env: ContainerEnvType) => {
	const townRepository = new TownRepositoryPostgres(getPool(env.DATABASE_URL), getDb())
	const townService = new TownService(townRepository)

	const businessRepository = new BusinessRepositoryPostgres(getPool(env.DATABASE_URL), getDb())
	const businessService = new BusinessService(businessRepository)

	const linkRepository = new LinkRepositoryPostgres(getPool(env.DATABASE_URL), getDb())
	const linkService = new LinkService(linkRepository)

	return {businessService, linkService, townService}
}
