import type {AutocompleteSource} from '@algolia/autocomplete-js'
import type {TownSearchResultType} from '@i/core/town'

import {townsSearch} from './townSearch'

export const alogliaTownSearch: AutocompleteSource<TownSearchResultType> = {
	getItemInputValue({item}) {
		return `${item.name} in ${item.county}`
	},
	getItems({query}) {
		return townsSearch(query)
	},
	sourceId: 'towns',
	templates: {
		item({item}) {
			return `${item.name} in ${item.county}`
		},
		noResults() {
			return 'No results'
		},
	},
}
