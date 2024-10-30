import {BusinessService} from '@i/core/business'
import {TownService} from '@i/core/town'
import {BusinessRepositoryPostgres, getDb, getPool, TownRepositoryPostgres} from '@i/repository'

import type {ContainerEnvType} from './ContainerEnvSchema'

export const createContainer = (env: ContainerEnvType) => {
	const townRepository = new TownRepositoryPostgres(getPool(env.DATABASE_URL), getDb())
	const townService = new TownService(townRepository)

	const businessRepository = new BusinessRepositoryPostgres(getPool(env.DATABASE_URL), getDb())
	const businessService = new BusinessService(businessRepository)

	return {businessService, townService}
}
