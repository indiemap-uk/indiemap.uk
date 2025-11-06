import type {MarkdownService} from './MarkdownService.js'

/** A mock Markdown service for testing */
export class MarkdownServiceMock implements MarkdownService {
  public async get(): Promise<string> {
    return 'Mock'
  }
}
