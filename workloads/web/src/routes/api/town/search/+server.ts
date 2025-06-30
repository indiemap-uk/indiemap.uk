import {TownNameSearchSchema} from '@i/core/town'
import {error, json} from '@sveltejs/kit'
import * as v from 'valibot'

export const GET = async ({locals, url}) => {
  const qParse = v.safeParse(TownNameSearchSchema, url.searchParams.get('q'))
  const hasBusiness = url.searchParams.get('hasBusiness') === 'true'

  if (qParse.issues) {
    error(400, qParse.issues.map((i) => i.message).join(', '))
  }

  const results = await locals.container.townService.search(qParse.output, hasBusiness)

  return json(results)
}
