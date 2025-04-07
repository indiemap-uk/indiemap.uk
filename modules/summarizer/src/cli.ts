import {KVSQLiteStore} from './services/KVSQLiteStore.js'
import {MarkdownServiceJinaAi} from './services/MarkdownServiceJinaAi.js'
import {SummarizerService} from './SummarizerService.js'

/**
This is a CLI version that can be used for quick testing during develpoment.

An example run:

tsx src/cli.ts url1,url2,url3
*/
const urls = process.argv[2]?.split(',')
const openAiApiKey = process.env.OPENAI_API_KEY as string
const kvstore = new KVSQLiteStore('cli.db')
const markdownService = new MarkdownServiceJinaAi(process.env.JINA_API_KEY as string)
const summarizerService = new SummarizerService(kvstore, markdownService, openAiApiKey)

summarizerService.summarizeUrls(urls ?? []).then((summary) => {
	console.log('summary:', summary)
})
