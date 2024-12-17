import {debounce} from '$lib/debounce'
import {TownSearchResultSchema, TownSearchSchema, type TownSearchType} from '@i/core/town'
import * as v from 'valibot'

export const searchTowns = (query: TownSearchType) => {
	const q = v.safeParse(TownSearchSchema, query)

	if (!q.success) {
		return []
	}

	return fetch(`/api/town/search?q=${q.output}`)
		.then((res) => res.json())
		.then((towns) => {
			return towns.map((town: unknown) => v.parse(TownSearchResultSchema, town))
		})
		.catch((error) => {
			console.error(error)

			return []
		})
}

export const debouncedSearchTowns = debounce(searchTowns, 300)
