import {faker} from '@faker-js/faker'
import {newBusinessId} from '@i/core/business'
import {type LinkType, newLinkId} from '@i/core/link'

export const linkFactory = (seed?: Partial<LinkType>): LinkType => {
  return {
    id: newLinkId(),
    businessId: newBusinessId(),
    label: faker.helpers.maybe(() => faker.company.buzzPhrase(), {probability: 0.6}),
    url: faker.internet.url(),
    ...seed,
  }
}
