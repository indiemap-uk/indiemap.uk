import {type LocationType, newLocationId} from '#location/index.js'
import {faker} from '@faker-js/faker'

export const locationFactory = (seed: Partial<LocationType>): LocationType => ({
  address: faker.location.streetAddress({useFullAddress: true}),
  id: newLocationId(),
  label: faker.lorem.word(),
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
  businessId: faker.string.uuid(),
  ...seed,
})
