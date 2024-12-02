import {faker} from '@faker-js/faker'
import Big from 'big.js'

/**
 * Returns new coordinates "near" a given latitude and longitude.

 * This is as simple as possible: just adds a small value (0.01) to the lat and lon.
 **/
export const makeRandomCoord = (latitude: number, longitude: number) => {
	const randomness = {
		fractionDigits: 3,
		max: 0.02,
		min: 0.01,
	}

	return {
		latitude: Big(latitude).plus(faker.number.float(randomness)).toNumber(),
		longitude: Big(longitude).plus(faker.number.float(randomness)).toNumber(),
	}
}
