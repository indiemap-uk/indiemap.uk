import {describe, expect, test} from 'vitest'
import {LinkService} from './LinkService.js'

describe('LinkService', () => {
  const linkService = new LinkService({} as any)

  test(`content URLs only`, () => {
    const urls = [
      'https://www.example.com/',
      'https://www.example.com/how-i-work-contact-faqs',
      'https://www.example.com/door-panel-examples',
      'https://www.example.com/entrance-examples',
      'https://www.example.com/miscwindowexamples',
      'https://www.example.com/glass-measuring',
      'https://www.facebook.com/Somepage/',
      'http://instagram.com/Some_Page',
      'http://www.tiktok.com/@Somepage',
      'http://www.youtube.com/@Some_Page',
    ]

    const filtered = linkService.contentUrlsOnly(urls)

    expect(filtered).toMatchInlineSnapshot(`
      [
        "https://www.example.com/",
        "https://www.example.com/how-i-work-contact-faqs",
        "https://www.example.com/door-panel-examples",
        "https://www.example.com/entrance-examples",
        "https://www.example.com/miscwindowexamples",
        "https://www.example.com/glass-measuring",
      ]
    `)
  })
})
