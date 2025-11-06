import {sourceFactory} from '#mock/sourceFactory.js'
import {SummarizerServiceMock} from '#summarizer/SummarizerServiceMock.js'
import {describe, expect, test} from 'vitest'
import {makeBusinessFromSummary} from '../tasks/makeBusinessSummary.js'
import {getDeps} from './getDeps.js'
import {mockHelpers} from './mockHelpers.js'

describe('makeBusinessFromSummary', () => {
  test('creates a business from a summary', async () => {
    const deps = getDeps()
    const task = makeBusinessFromSummary(deps)
    const url = 'https://example.com'
    const markdown1 = 'Very good business'
    const payload = {
      source: sourceFactory({urls: [url]}),
      markdowns: [markdown1],
    }

    await task(payload, mockHelpers)

    const [business] = await deps.businessService.search({status: 'draft'})

    expect({
      description: business?.description,
      name: business?.name,
      status: business?.status,
      townId: business?.townId,
    }).toMatchInlineSnapshot(`
      {
        "description": "mock",
        "name": "mock",
        "status": "draft",
        "townId": null,
      }
    `)
  })

  test(`links from the Source and Summary are merged, only top level pages are kept`, async () => {
    const sourceLinks = [
      'https://www.example.com/', // appears only once
      'https://www.example.com/shop', // won't be kept
      'https://facebook.com/page', // appears only once
    ]
    const summarizerService = new SummarizerServiceMock({
      links: [
        ...sourceLinks,
        'https://youtube.com/channel', // will be added
      ],
    })
    const deps = getDeps({summarizerService})
    const task = makeBusinessFromSummary(deps)

    await task({
      source: sourceFactory({urls: sourceLinks}),
      markdowns: ['Very good business'],
    }, mockHelpers)

    const [business] = await deps.businessService.search({status: 'draft'})
    if (!business?.id) {
      throw new Error('Business ID is missing')
    }
    const links = await deps.linkService.getByBusinessId(business.id)

    expect(links.map(l => l.url)).toMatchInlineSnapshot(`
      [
        "https://www.example.com/",
        "https://facebook.com/page",
        "https://youtube.com/channel",
      ]
    `)
  })
})
