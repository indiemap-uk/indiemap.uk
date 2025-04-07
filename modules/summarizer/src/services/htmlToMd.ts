import {type ConversionOptions, convertHtmlToMarkdown} from 'dom-to-semantic-markdown'
import {JSDOM} from 'jsdom'

/**
 * Given a HTML string, convert it to markdown.
 */
export const htmlToMd = (html: string, options: ConversionOptions = {}) => {
	const dom = new JSDOM(html)

	return convertHtmlToMarkdown(html, {
		enableTableColumnTracking: true,
		includeMetaData: 'extended',
		overrideDOMParser: new dom.window.DOMParser(),
		refifyUrls: false,
		...options,
	})
}
