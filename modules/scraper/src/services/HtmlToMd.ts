import {type ConversionOptions, convertHtmlToMarkdown} from 'dom-to-semantic-markdown'
import {Effect} from 'effect'
import {JSDOM} from 'jsdom'

export const HtmlToMd = (html: string, options: ConversionOptions = {}) => {
	const dom = new JSDOM(html)
	let markdown: string
	try {
		markdown = convertHtmlToMarkdown(html, {
			refifyUrls: false,
			enableTableColumnTracking: true,
			overrideDOMParser: new dom.window.DOMParser(),
			includeMetaData: 'extended',
			...options,
		})
	} catch (e) {
		throw e
	}

	return Effect.succeed(markdown)
}
