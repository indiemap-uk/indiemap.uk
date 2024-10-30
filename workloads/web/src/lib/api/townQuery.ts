import {type TownSearchResultType} from '@i/core/town'
import {createQuery} from '@tanstack/svelte-query'
import ky from 'ky'
import {derived, writable} from 'svelte/store'

const townSearchAPI = (q: string) => ky.get<TownSearchResultType[]>(`/api/town/search?q=${q}`).json()

export const useTownSearch = () => {
	const townSearchFilter = writable('')

	const townQuery = createQuery<TownSearchResultType[]>(
		derived(townSearchFilter, ($townFilter) => {
			return {
				enabled: $townFilter.length > 2,
				queryFn: () => townSearchAPI($townFilter),
				queryKey: ['towns', $townFilter],
				staleTime: Number.POSITIVE_INFINITY, // town data never changes
			}
		}),
	)

	return {
		townQuery,
		townSearchFilter,
	}
}
