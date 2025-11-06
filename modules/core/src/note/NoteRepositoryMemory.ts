import type {NoteRepository} from './NoteRepository.js'
import {type NoteCreateType, type NoteType, type NoteUpdateType, newNoteId} from './index.js'

export class NoteRepositoryMemory implements NoteRepository {
  private notes: Map<string, NoteType> = new Map()

  async create(data: NoteCreateType): Promise<NoteType> {
    const id = newNoteId()
    const now = new Date().toISOString()
    const note: NoteType = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    }

    this.notes.set(id, note)
    return note
  }

  async update(data: NoteUpdateType): Promise<NoteType> {
    const existing = this.notes.get(data.id)
    if (!existing) {
      throw new Error(`Note with id ${data.id} not found`)
    }

    const updated: NoteType = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.notes.set(data.id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    this.notes.delete(id)
  }

  async findById(id: string): Promise<NoteType | undefined> {
    return this.notes.get(id)
  }

  async findByEntityId(entityType: string, entityId: string): Promise<NoteType[]> {
    return Array.from(this.notes.values())
      .filter(note => note.entityType === entityType && note.entityId === entityId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async findAll(): Promise<NoteType[]> {
    return Array.from(this.notes.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
}
