import {BusinessSearchSchema} from '@i/core/business'
import {error, json} from '@sveltejs/kit'
import Debug from 'debug'
import * as v from 'valibot'

const debug = Debug('indie:web:business-search')

export const GET = async ({locals, url}) => {
	const q = {
		name: url.searchParams.get('name'),
		// 1+ number or nothing
		townId: Number(url.searchParams.get('townId')) || null,
	}
	debug(`q %j`, q)

	const qParse = v.safeParse(BusinessSearchSchema, q)

	if (qParse.issues) {
		error(400, qParse.issues.map((i) => `${i.path?.[0].key}: ${i.message}`).join(', '))
	}

	const results = await locals.container.businessService.search(qParse.output)

	return json(results)
}
