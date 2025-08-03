import type {NoteCreateType, NoteType, NoteUpdateType} from './index.js'

export interface NoteRepository {
  create(data: NoteCreateType): Promise<NoteType>
  update(data: NoteUpdateType): Promise<NoteType>
  delete(id: string): Promise<void>
  findById(id: string): Promise<NoteType | undefined>
  findByEntityId(entityType: string, entityId: string): Promise<NoteType[]>
  findAll(): Promise<NoteType[]>
}
