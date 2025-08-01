import {fakerEN_GB as faker} from '@faker-js/faker'
import Debug from 'debug'
import * as v from 'valibot'

import {check} from './check.js'
import {getContainer} from './getContainer.js'
import {makeRandomCoord} from './makeRandomCoord.js'

const debug = Debug('indie:mock')

export type Container = ReturnType<typeof getContainer>

const EnvSchema = v.object({
  /**
   * The full DB URL, e.g. postgres://indie:indie@localhost:5431/indie?sslmode=disable
   */
  DATABASE_URL: v.string(),
  /** The number of towns to generate */
  TOWNS: v.nullish(v.pipe(v.string(), v.transform(Number), v.number())),
})

debug('Parsing env')
const env = v.parse(EnvSchema, process.env)

const numberOfTowns = env.TOWNS ?? 500
const businessPerTownMin = 1
const businessPerTownMax = 20
const locationsPerBusinessMin = 0
const locationsPerBusinessMax = 5
const linksPerBusinessMin = 0
const linksPerBusinessMax = 5
const productsPerBusinessMin = 0
const productsPerBusinessMax = 10

const mock = async () => {
  debug('Starting mock data generation with these params:')
  debug('%o', {
    businessPerTownMax,
    businessPerTownMin,
    linksPerBusinessMax,
    linksPerBusinessMin,
    locationsPerBusinessMax,
    locationsPerBusinessMin,
    numberOfTowns,
    productsPerBusinessMax,
    productsPerBusinessMin,
  })

  debug('Creating container')
  const container = getContainer(env)
  debug('Running checks')
  await check(container)

  const randomTowns = await container.townService.getRandoms(numberOfTowns)

  const businesses = []
  let totalLocations = 0
  let totalLinks = 0
  let totalProducts = 0

  // In each town create min-max businesses
  debug('Generating businesses...')
  for (const town of randomTowns) {
    // Deal with a town
    const businessInTownTarget = faker.number.int({max: businessPerTownMax, min: businessPerTownMin})
    let businessesInTown = 0
    while (businessesInTown < businessInTownTarget) {
      const createdAt = faker.date.past({years: 2}).toISOString()
      const updatedAt = faker.helpers.maybe(() => faker.date.between({from: createdAt, to: new Date()}))?.toISOString()
      const b = await container.businessService.create(
        {
          description: faker.lorem.paragraphs(faker.number.int({max: 5, min: 1})),
          name: faker.company.name(),
          status: 'live',
          townId: town.id,
        },
        {createdAt, updatedAt: updatedAt ?? createdAt},
      )

      businessesInTown++
      businesses.push(b)
    }
  }

  // then for each business, create 0-5 random locations (near the town of business)
  debug('Generating locations...')
  for (const business of businesses) {
    const locationCountTarget = faker.number.int({max: locationsPerBusinessMax, min: locationsPerBusinessMin})
    if (locationCountTarget === 0) {
      continue
    }

    const businessTown = randomTowns.find((t) => t.id === business.townId)
    if (!businessTown) {
      throw new Error(`Town not found for business ${business}`)
    }

    let locationCount = 0
    while (locationCount < locationCountTarget) {
      const randomCoord = makeRandomCoord(businessTown.latitude, businessTown.longitude)
      await container.locationService.create(
        {
          address: faker.location.streetAddress(),
          businessId: business.id,
          label: faker.commerce.department(),
        },
        randomCoord,
      )
      locationCount++
    }
    totalLocations += locationCount
  }

  // then for each business, create 0-5 random URLs
  debug('Creating links...')
  for (const business of businesses) {
    const linkTargetCount = faker.number.int({max: linksPerBusinessMax, min: linksPerBusinessMin})
    if (linkTargetCount === 0) {
      continue
    }

    let linkCount = 0
    while (linkCount < linkTargetCount) {
      await container.linkService.create({
        businessId: business.id,
        label: faker.book.title(),
        url: faker.internet.url(),
        order: linkCount,
      })
      linkCount++
    }
    totalLinks += linkCount
  }

  // then for each business, create 0-50 random products
  debug('Creating products...')
  for (const business of businesses) {
    const productTargetCount = faker.number.int({max: productsPerBusinessMax, min: productsPerBusinessMin})
    if (productTargetCount === 0) {
      continue
    }

    let productCount = 0
    while (productCount < productTargetCount) {
      await container.productService.create({
        businessId: business.id,
        originalName: faker.commerce.productName(),
      })
      productCount++
    }
    totalProducts += productCount
  }

  await container.end()

  debug(
    '🦔 Done! Generated %s businesses in %s towns, %s locations, %s links and %s products',
    businesses.length,
    numberOfTowns,
    totalLocations,
    totalLinks,
    totalProducts,
  )
}

mock()
