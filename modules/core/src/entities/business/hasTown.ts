import type {BusinessResolvedType} from './BusinessType.js'

export const hasTown = (
	business: BusinessResolvedType,
): business is BusinessResolvedType & {town: NonNullable<BusinessResolvedType['town']>} => {
	return !!business.town
}
