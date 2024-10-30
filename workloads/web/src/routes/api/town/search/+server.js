import {TownSearchSchema} from '@i/core/town'
import {error, json} from '@sveltejs/kit'
import * as v from 'valibot'

export const GET = async ({locals, url}) => {
	const qParse = v.safeParse(TownSearchSchema, url.searchParams.get('q'))

	if (qParse.issues) {
		error(400, qParse.issues.map((i) => i.message).join(', '))
	}

	const results = await locals.container.townService.search(qParse.output)

	return json(results)
}
