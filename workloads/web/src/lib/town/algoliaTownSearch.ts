import type {AutocompleteSource} from '@algolia/autocomplete-js'
import type {TownSearchResultType} from '@i/core/town'

import {townsSearch} from './townSearch'

export const alogliaTownSearch: AutocompleteSource<TownSearchResultType> = {
	getItemInputValue({item}) {
		return `${item.name} in ${item.county}`
	},
	getItems({query}) {
		return townsSearch(query, true)
	},
	getItemUrl({item}) {
		return `/town/${item.id}`
	},
	sourceId: 'towns',
	templates: {
		header({html, items}) {
			return items.length ? html`<span class="aa-SourceHeaderTitle">Towns</span>` : ''
		},
		item({html, item}) {
			return html`<a href="/town/${item.id}">${item.name} <span>${item.county}</span></a>`
		},
	},
}
