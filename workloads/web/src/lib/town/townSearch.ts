import {debounce} from '$lib/debounce'
import {TownNameSearchSchema, type TownNameSearchType, TownSearchResultSchema} from '@i/core/town'
import * as v from 'valibot'

const townAPISearch = (query: TownNameSearchType, hasBusiness = false) => {
	const q = v.safeParse(TownNameSearchSchema, query)

	if (!q.success) {
		return []
	}

	return fetch(`/api/town/search?q=${q.output}&hasBusiness=${hasBusiness}`)
		.then((res) => res.json())
		.then((towns) => {
			return towns.map((town: unknown) => v.parse(TownSearchResultSchema, town))
		})
		.catch((error) => {
			console.error(error)

			return []
		})
}

export const townsSearch = debounce(townAPISearch, 300)
