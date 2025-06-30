import {request} from 'undici'

import {htmlToMd} from './htmlToMd.js'

export const getHtml = async (url: string): Promise<string> => {
  const {body, statusCode} = await request(url, {
    method: 'GET',
  })

  if (statusCode !== 200) {
    const md = htmlToMd(await body.text(), {
      extractMainContent: true,
      includeMetaData: false,
    })
    throw new Error(`HTTP status code ${statusCode} for ${url}: \n\n${md}`)
  }

  return body.text()
}
