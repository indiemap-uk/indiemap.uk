import * as v from 'valibot'
import type {NoteRepository} from './NoteRepository.js'
import type {NoteCreateSchema, NoteSchema, NoteUpdateSchema} from './NoteSchema.js'

type NoteType = v.InferOutput<typeof NoteSchema>
type NoteCreateType = v.InferOutput<typeof NoteCreateSchema>
type NoteUpdateType = v.InferOutput<typeof NoteUpdateSchema>

export class NoteService {
  constructor(private readonly noteRepository: NoteRepository) {}

  async create(newNote: NoteCreateType) {
    return this.noteRepository.create(newNote)
  }

  async update(note: NoteUpdateType) {
    return this.noteRepository.update(note)
  }

  async delete(id: string) {
    return this.noteRepository.delete(id)
  }

  async getById(id: string): Promise<NoteType | undefined> {
    return this.noteRepository.findById(id)
  }

  async getByEntityId(entityType: string, entityId: string): Promise<NoteType[]> {
    return this.noteRepository.findByEntityId(entityType, entityId)
  }

  async getAll(): Promise<NoteType[]> {
    return this.noteRepository.findAll()
  }
}
