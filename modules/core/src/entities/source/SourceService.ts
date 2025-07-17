import type {BusinessIdType} from '../business/BusinessType.js'
import type {SourceRepository} from './SourceRepository.js'
import type {SourceCreateType, SourceResolvedType, SourceUpdateType} from './SourceType.js'
import {nonContentDomains} from './nonContentDomains.js'

export class SourceService {
  constructor(private readonly sourceRepository: SourceRepository) {}

  async create(newSource: SourceCreateType) {
    return this.sourceRepository.create(newSource)
  }

  delete(id: string) {
    return this.sourceRepository.delete(id)
  }

  async getById(id: string): Promise<SourceResolvedType | null> {
    return this.sourceRepository.getById(id)
  }

  async getByBusinessId(id: BusinessIdType) {
    return this.sourceRepository.getByBusinessId(id)
  }

  async update(source: SourceUpdateType) {
    await this.sourceRepository.update(source)
  }

  async search(): Promise<SourceResolvedType[]> {
    return this.sourceRepository.search()
  }

  getLinksFromMarkdown(markdown: string): string[] {
    return this.pickRelevantLinks(this.linksFromMarkdown(markdown))
  }

  /**
   * Filters out non-content URLs, i.e. social media pages.
   * These do not add relevant content (too much noise) when we try to generata a business summary.
   */
  contentUrlsOnly(urls: string[]): string[] {
    return urls.filter(url => {
      const domain = new URL(url).hostname.replaceAll('www.', '')
      if (!domain) return false
      return !nonContentDomains.includes(domain)
    })
  }

  /**
   * Non content URLs only, i.e. social media pages.
   */
  nonContentUrlsOnly(urls: string[]): string[] {
    return urls.filter(url => {
      const domain = new URL(url).hostname.replaceAll('www.', '')
      if (!domain) return false
      return nonContentDomains.includes(domain)
    })
  }

  private pickRelevantLinks(links: string[]): string[] {
    return links.filter(link => {
      // Filter out non-absolute links (relative paths)
      if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return false
      }

      // Filter out internal anchors
      if (link.includes('#')) {
        return false
      }

      // Filter out mailto links
      if (link.startsWith('mailto:')) {
        return false
      }

      return true
    })
  }

  /**
   * linksFromMarkdown expect a markdown with links placed at the end and returns an array of URLs.
   *
   *  The input format matches the jina.ai Reader output.
   * See tests and https://jina.ai/reader
   */
  private linksFromMarkdown(markdown: string): string[] {
    const linksSectionMarker = 'Links/Buttons:'
    const linksSectionIndex = markdown.indexOf(linksSectionMarker)

    if (linksSectionIndex === -1) {
      return []
    }

    const linksSection = markdown.substring(linksSectionIndex + linksSectionMarker.length)
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g
    const links: string[] = []

    let match
    while ((match = linkRegex.exec(linksSection)) !== null) {
      const url = match[2]
      if (url && url.trim()) {
        links.push(url.trim())
      }
    }

    return links
  }
}
