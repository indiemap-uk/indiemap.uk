import type {BusinessIdType} from '../business/BusinessType.js'
import type {SourceCreateType, SourceType} from './SourceType.js'

export type SourceRepository = {
  getById(id: string): Promise<SourceType | null>
  create(data: SourceCreateType): Promise<SourceType>
  delete(id: string): Promise<void>
  getByBusinessId(id: BusinessIdType): Promise<SourceType | null>
  update(data: SourceType): Promise<void>
}
