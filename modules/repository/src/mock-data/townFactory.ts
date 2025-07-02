import {faker} from '@faker-js/faker'
import type {TownType} from '@i/core/town'

export const townFactory = (seed?: Partial<TownType>) => {
  return {
    country: faker.location.country().substring(0, 15),
    county: faker.location.county(),
    easting: faker.number.int({min: 100_000, max: 700_000}),
    elevation: faker.number.int({min: 0, max: 1000}),
    gridReference: faker.string.alphanumeric({length: 8}),
    id: faker.number.int({min: 5_000, max: 50_000}),
    latitude: faker.location.latitude({min: 49.5, max: 61.0}),
    localGovernmentArea: faker.location.city(),
    longitude: faker.location.longitude({min: -8.0, max: 2.0}),
    name: faker.location.city(),
    northing: faker.number.int({min: 100_000, max: 200_000}),
    nutsRegion: `UK${faker.string.alpha({length: 3, casing: 'upper'})}`,
    postcodeSector: faker.string.alphanumeric({length: 6}),
    type: faker.helpers.arrayElement(['City', 'Town', 'Village', 'Hamlet']),
    ...seed,
  }
}
