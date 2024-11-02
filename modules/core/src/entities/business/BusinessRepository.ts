import type {BusinessCreateType, BusinessIdType, BusinessType} from './BusinessType.js'

export type BusinessRepository = {
	create(data: BusinessCreateType): Promise<BusinessType>
	delete(id: BusinessIdType): Promise<void>
	getById(id: BusinessIdType): Promise<BusinessType | null>
	list(): Promise<BusinessType[]>
	update(data: BusinessType): Promise<BusinessType>
}
