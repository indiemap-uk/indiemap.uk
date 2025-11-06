import {newBusinessId} from '#business/index.js'
import {type SourceType, newSourceId} from '#source/index.js'
import {faker} from '@faker-js/faker'

export const sourceFactory = (seed?: Partial<SourceType>): SourceType => {
  return {
    id: newSourceId(),
    businessId: faker.helpers.maybe(() => newBusinessId(), {probability: 0.8}),
    urls: faker.helpers.multiple(() => faker.internet.url(), {count: {min: 1, max: 3}}),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...seed,
  }
}
