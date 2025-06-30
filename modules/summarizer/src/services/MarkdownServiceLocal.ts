import type {MarkdownService} from './MarkdownService.js'

import {getHtml} from './getHtml.js'
import {htmlToMd} from './htmlToMd.js'

/** A Markdown service that uses the local server to process the request */
export class MarkdownServiceLocal implements MarkdownService {
  public async get(url: string) {
    const html = await getHtml(url)

    return htmlToMd(html, {
      extractMainContent: false,
      includeMetaData: 'extended',
      websiteDomain: new URL(url).hostname,
    })
  }
}
