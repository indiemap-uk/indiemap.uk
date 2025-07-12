import type {BusinessIdType} from '../business/BusinessType.js'
import type {SourceCreateType, SourceResolvedType, SourceType, SourceUpdateType} from './SourceType.js'

export type SourceRepository = {
  getById(id: string): Promise<SourceResolvedType | null>
  create(data: SourceCreateType): Promise<SourceType>
  delete(id: string): Promise<void>
  getByBusinessId(id: BusinessIdType): Promise<SourceType | null>
  update(data: SourceUpdateType): Promise<void>
  search(): Promise<SourceResolvedType[]>
}
