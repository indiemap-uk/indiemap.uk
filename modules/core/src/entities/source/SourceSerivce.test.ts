import {describe, expect, test} from 'vitest'
import {SourceService} from './SourceService.js'

describe('Source Service', () => {
  const s = new SourceService({} as any)

  describe(`Get Links From Markdown`, () => {
    test('ignores emails and anchors', () => {
      const markdown = `Some content...
Some content...
Some content...

Links/Buttons:
- [HOME](https://www.example.com/)
- [TOP](https://www.example.com#top)
- [HOW I WORK/CONTACT/FAQ's](https://www.example.com/how-i-work-contact-faqs)
- [Info@example.com](mailto:Info@example.com)
- [www.youtube.com/@Somepage](http://www.youtube.com/@Somepage)`

      const result = s.getLinksFromMarkdown(markdown)

      expect(result).toMatchInlineSnapshot(`
        [
          "https://www.example.com/",
          "https://www.example.com/how-i-work-contact-faqs",
          "http://www.youtube.com/@Somepage",
        ]
      `)
    })
  })

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

    const filtered = s.contentUrlsOnly(urls)

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
