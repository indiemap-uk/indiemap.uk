import {describe, expect, test} from 'vitest'
import {SourceService} from './SourceService.js'

describe('Source Service', () => {
  describe(`Get Links From Markdown`, () => {
    test('ignores emails and anchors', () => {
      const s = new SourceService({} as any)
      const markdown = `Some content...
Some content...
Some content...

Links/Buttons:
- [HOME](https://www.lightleadeddesigns.com/)
- [TOP](https://www.lightleadeddesigns.com#top)
- [HOW I WORK/CONTACT/FAQ's](https://www.lightleadeddesigns.com/how-i-work-contact-faqs)
- [Info@lightleadeddesigns.com](mailto:Info@lightleadeddesigns.com)
- [www.youtube.com/@JanLightLeadedDesigns](http://www.youtube.com/@JanLightLeadedDesigns)`

      const result = s.getLinksFromMarkdown(markdown)

      expect(result).toMatchInlineSnapshot(`
      [
        "https://www.lightleadeddesigns.com/",
        "https://www.lightleadeddesigns.com/how-i-work-contact-faqs",
        "http://www.youtube.com/@JanLightLeadedDesigns",
      ]
    `)
    })
  })
})
