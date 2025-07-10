import {faker} from '@faker-js/faker'
import {type BusinessType, newBusinessId} from '@i/core/business'

export const businessFactory = (seed?: Partial<BusinessType>): BusinessType => {
  return {
    description: faker.helpers.maybe(() => faker.company.catchPhrase(), {probability: 0.7}),
    id: newBusinessId(),
    name: faker.company.name().substring(0, 100),
    status: faker.helpers.arrayElement(['live', 'draft']),
    townId: faker.number.int({min: 5_000, max: 50_000}),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...seed,
  }
}
