import type {BusinessIdType} from '../business/BusinessType.js'
import type {LinkRepository} from './LinkRepository.js'
import type {LinkCreateType, LinkIdType, LinkType} from './LinkType.js'

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
}
