import {debounce} from '$lib/debounce'
import {BusinessResolvedSchema, BusinessSearchSchema, type BusinessSearchType} from '@i/core/business'
import * as v from 'valibot'

const businessSearchAPI = (query: BusinessSearchType) => {
	const q = v.safeParse(BusinessSearchSchema, query)

	if (!q.success) {
		return []
	}

	return fetch(`/api/business/search?name=${q.output.name}&townId=${q.output.townId}`)
		.then((res) => res.json())
		.then((bs) => {
			return bs.map((b: unknown) => v.parse(BusinessResolvedSchema, b))
		})
		.catch((error) => {
			console.error(error)

			return []
		})
}

export const businessSearch = debounce(businessSearchAPI, 300)
