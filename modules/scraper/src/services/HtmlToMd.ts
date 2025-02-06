import {type ConversionOptions, convertHtmlToMarkdown} from 'dom-to-semantic-markdown'
import {Effect} from 'effect'
import {JSDOM} from 'jsdom'

export const HtmlToMd = (html: string, options: ConversionOptions = {}) => {
	const dom = new JSDOM(html)
	const markdown = convertHtmlToMarkdown(html, {
		enableTableColumnTracking: true,
		includeMetaData: 'extended',
		overrideDOMParser: new dom.window.DOMParser(),
		refifyUrls: false,
		...options,
	})

	return Effect.succeed(markdown)
}
