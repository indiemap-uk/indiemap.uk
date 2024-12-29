import type {
	BusinessCreateType,
	BusinessIdType,
	BusinessResolvedType,
	BusinessSearchType,
	BusinessType,
} from './BusinessType.js'

export interface BusinessListArgs {
	limit?: number
	offset?: number
	order?: {
		by: keyof BusinessType
		direction: 'ASC' | 'DESC'
	}
}

export type BusinessRepository = {
	create(data: BusinessCreateType): Promise<BusinessType>
	delete(id: BusinessIdType): Promise<void>
	getById(id: BusinessIdType, status?: BusinessType['status']): Promise<BusinessResolvedType | null>
	search(
		query: BusinessSearchType,
		args?: BusinessListArgs,
		status?: BusinessType['status'],
	): Promise<BusinessResolvedType[]>
	update(data: BusinessType): Promise<BusinessResolvedType>
}
