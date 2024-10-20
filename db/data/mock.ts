import { fakerEN_GB as faker } from "@faker-js/faker"
import * as db from "zapatos/db"
import { pool } from "../pool"

/**
 * Generates a lot of fake data.
 *
 * THE UK TOWN DATA MUST ALREADY BE INSTALLED!
 */

// The largest town ID in the DB
const maxTownId = 49225
// How many links to add to a vendor (min, max)
const linksPerIndie = [0, 10]
// How many vendors to add to a town (min, max)
const indiesPerTown = [1, 10]
// How many indies to add to the DB in total
const indieCount = 10

export const mock = async () => {
	const indies = []

	while (indies.length < indieCount) {
		const town = await pickRandomTown()

		const indiesInTown = faker.number.int({
			min: indiesPerTown[0],
			max: indiesPerTown[1],
		})

		let iit = 0

		while (iit < indiesInTown) {
			indies.push(await generateIndie(town.id))
			iit++
		}

		console.log("Added %s indies to %s", indiesInTown, town.name)
	}
	console.log("Generated %s indies in total", indies.length)

	console.log("Adding links...")
	for (const indie of indies) {
		await addLinksToIndie(indie.id)
	}
	console.log(`Done.`)

	await pool.end()
}

/** Returns a random town ID, which is just an int between 1 and the max - no need to access the DB */
const pickRandomTown = async () => faker.number.int({ min: 1, max: maxTownId })

const generateIndie = async (townId: number) =>
	db
		.insert("indies", {
			name: faker.person.fullName(),
			description: faker.commerce.productDescription(),
			town_id: townId,
		})
		.run(pool)

const addLinksToIndie = async (indieId: string) => {
	const links = faker.helpers
		.multiple(() => faker.internet.url({ protocol: "https" }), {
			count: faker.number.int({
				min: linksPerIndie[0],
				max: linksPerIndie[1],
			}),
		})
		.map((url) => ({
			url,
			label: faker.commerce.productName(),
			indie_id: indieId,
		}))

	return db.insert("links", links).run(pool)
}

try {
	mock()
} catch (e: unknown) {
	console.error(e)
}
