import {KVPostgresStore} from '@i/repository/KVPostgresStore'
import * as v from 'valibot'

import {EnvSchema} from './EnvSchema.js'
import {MarkdownServiceJinaAi} from './services/MarkdownServiceJinaAi.js'
import {SummarizerService} from './SummarizerService.js'

/**
This is a CLI version that can be used for quick testing during develpoment.

An example run:

tsx src/cli.ts url1,url2,url3
*/
const urls = process.argv[2]?.split(',')
const env = v.parse(EnvSchema, process.env)
const kvstore = new KVPostgresStore({
	schema: 'public',
	table: 'keyv',
	uri: env.DATABASE_URL,
})
const markdownService = new MarkdownServiceJinaAi(env.JINA_API_KEY)
const summarizerService = new SummarizerService(kvstore, markdownService, env.OPENAI_API_KEY)

summarizerService.summarizeUrls(urls ?? []).then((summary) => {
	console.log('summary:', summary)
})
