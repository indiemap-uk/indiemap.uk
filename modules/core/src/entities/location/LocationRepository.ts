import type {BusinessIdType} from '../business/BusinessType.js'
import type {LocationCreateType, LocationIdType, LocationType} from './LocationType.js'

export interface LocationRepository {
  create(data: LocationCreateType): Promise<LocationType>
  delete(id: LocationIdType): Promise<void>
  getByBusinessId(id: BusinessIdType): Promise<LocationType[]>
  update(data: LocationType): Promise<LocationType>
}
