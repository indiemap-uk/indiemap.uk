import type {BusinessIdType} from '#business/BusinessType.js'
import type {LinkRepository} from './LinkRepository.js'
import type {LinkCreateType, LinkIdType, LinkType} from './LinkType.js'
import {nonContentDomains} from './nonContentDomains.js'

export class LinkService {
  constructor(private readonly linkRepository: LinkRepository) {}

  async create(newLink: LinkCreateType) {
    return this.linkRepository.create(newLink)
  }

  delete(id: LinkIdType) {
    return this.linkRepository.delete(id)
  }

  async getByBusinessId(id: BusinessIdType) {
    return this.linkRepository.getByBusinessId(id)
  }

  async update(link: LinkType) {
    await this.linkRepository.update(link)
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

  /**
   * Filters out sub-pages from the list of URLs that are not public/social media sites.
   * The point is to strip out example.com/contact-us etc, but keep example.com and youtube.com/@some-profile
   */
  filterOutContentSubpages(urls: string[]): string[] {
    return urls.filter(url => {
      const u = new URL(url)
      const domain = u.hostname.replaceAll('www.', '')
      if (!domain) return false

      // keep social media
      if (nonContentDomains.includes(domain)) {
        return true
      }

      // return false if the URL has a sub folder in it
      if (u.pathname !== '/' && u.pathname !== '') {
        return false
      }

      return true
    })
  }
}
