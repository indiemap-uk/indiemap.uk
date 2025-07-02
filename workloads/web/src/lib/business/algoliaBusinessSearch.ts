import type {AutocompleteSource} from '@algolia/autocomplete-js'
import type {BusinessResolvedType} from '@i/core/business'

import {businessSearch} from './businessSearch'

export const alogliaBusinessSearch: AutocompleteSource<BusinessResolvedType> = {
  getItemInputValue({item}) {
    return item.name
  },
  getItems({query}) {
    return businessSearch({
      name: query,
    })
  },
  getItemUrl({item}) {
    return `/business/${item.id}`
  },
  onSelect({item, setQuery, setIsOpen}) {
    setQuery(item.name)
    setIsOpen(false)
  },
  sourceId: 'businesses',
  templates: {
    header({html, items}) {
      return items.length ? html`<span class="aa-SourceHeaderTitle">Businesses</span>` : ''
    },
    item({html, item}) {
      return html`<a href="/business/${item.id}">${item.name} <span>${item.town ? item.town.name : ''}</span></a>`
    },
  },
}
