import type {BusinessCreateType, BusinessIdType, BusinessResolvedType, BusinessType} from './BusinessType.js'

export type BusinessRepository = {
	create(data: BusinessCreateType): Promise<BusinessResolvedType>
	delete(id: BusinessIdType): Promise<void>
	getById(id: BusinessIdType): Promise<BusinessResolvedType | null>
	list(): Promise<BusinessResolvedType[]>
	update(data: BusinessType): Promise<BusinessResolvedType>
}
