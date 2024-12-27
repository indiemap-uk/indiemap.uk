import {fakerEN_GB as faker} from '@faker-js/faker'
import Debug from 'debug'
import * as v from 'valibot'

import {check} from './check.js'
import {getContainer} from './getContainer.js'
import {makeRandomCoord} from './makeRandomCoord.js'

const debug = Debug('indie:mock-data')

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
	})

	debug('Creating container')
	const container = getContainer(env)
	debug('Running checks')
	await check(container)

	const randomTowns = await container.townService.getRandoms(numberOfTowns)

	const businesses = []
	let totalLocations = 0
	let totalLinks = 0

	// In each town create min-max businesses
	debug('Generating businesses...')
	for (const town of randomTowns) {
		// Deal with a town
		const businessInTownTarget = faker.number.int({max: businessPerTownMax, min: businessPerTownMin})
		let businessesInTown = 0
		while (businessesInTown < businessInTownTarget) {
			const createdAt = faker.date.past({years: 2})
			const updatedAt = faker.helpers.maybe(() => faker.date.between({from: createdAt, to: new Date()}))
			const b = await container.businessService.create({
				createdAt,
				description: faker.lorem.paragraphs(faker.number.int({max: 5, min: 1})),
				name: faker.company.name(),
				townId: town.id,
				updatedAt: updatedAt ?? createdAt,
			})

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
			})
			linkCount++
		}
		totalLinks += linkCount
	}

	await container.end()

	debug(
		'🦔 Done! Generated %s businesses in %s towns, %s locations and %s links',
		businesses.length,
		numberOfTowns,
		totalLocations,
		totalLinks,
	)
}

mock()
