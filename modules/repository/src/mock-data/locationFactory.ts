import {faker} from '@faker-js/faker'
import {type LocationType, newLocationId} from '@i/core/location'

export const locationFactory = (seed: Partial<LocationType>): LocationType => ({
  address: faker.location.streetAddress({useFullAddress: true}),
  id: newLocationId(),
  label: faker.lorem.word(),
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
  businessId: faker.string.uuid(),
  ...seed,
})
