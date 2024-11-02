import type {BusinessCreateType, BusinessType} from './BusinessType.js'

export type BusinessRepository = {
	create(data: BusinessCreateType): Promise<BusinessType>
	list(): Promise<BusinessType[]>
}
