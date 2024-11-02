import type {LinkCreateType, LinkType} from './LinkType.js'

export type LinkRepository = {
	create(data: LinkCreateType): Promise<LinkType>
}
