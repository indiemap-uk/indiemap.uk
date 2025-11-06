import {newBusinessId} from '#business/index.js'
import {type LinkType, newLinkId} from '#link/index.js'
import {faker} from '@faker-js/faker'

export const linkFactory = (seed?: Partial<LinkType>): LinkType => {
  return {
    id: newLinkId(),
    businessId: newBusinessId(),
    label: faker.helpers.maybe(() => faker.company.buzzPhrase(), {probability: 0.6}),
    url: faker.internet.url(),
    order: 0,
    ...seed,
  }
}
