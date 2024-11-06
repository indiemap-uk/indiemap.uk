import type {BusinessIdType} from '../business/BusinessType.js'
import type {LinkCreateType, LinkIdType, LinkType} from './LinkType.js'

export type LinkRepository = {
	create(data: LinkCreateType): Promise<LinkType>
	delete(id: LinkIdType): Promise<void>
	getByBusinessId(id: BusinessIdType): Promise<LinkType[]>
	update(data: LinkType): Promise<void>
}
