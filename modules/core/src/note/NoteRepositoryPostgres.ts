import {and, desc, eq} from 'drizzle-orm'
import * as v from 'valibot'

import {CRUDRepositoryPostgres} from '#db/CRUDRepositoryPostgres.js'
import {notes} from '#db/schema/schema.js'
import {parseSchema} from '#schema/index.js'
import type {NoteRepository} from './NoteRepository.js'
import {type NoteCreateType, type NoteUpdateType, NoteSchema, newNoteId} from './index.js'

export class NoteRepositoryPostgres extends CRUDRepositoryPostgres implements NoteRepository {
  async create(data: NoteCreateType) {
    const noteData = {
      ...data,
      id: newNoteId(),
    }

    const result = await this.db.insert(notes).values(noteData).returning()

    return parseSchema(NoteSchema, result[0])
  }

  async update(data: NoteUpdateType) {
    const result = await this.db
      .update(notes)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notes.id, data.id))
      .returning()

    if (result.length === 0) {
      throw new Error(`Note with id ${data.id} not found`)
    }

    return parseSchema(NoteSchema, result[0])
  }

  async delete(id: string) {
    await this.db.delete(notes).where(eq(notes.id, v.parse(v.string(), id)))
  }

  async findById(id: string) {
    const result = await this.db.select().from(notes).where(eq(notes.id, v.parse(v.string(), id)))

    if (result.length === 0) {
      return undefined
    }

    return parseSchema(NoteSchema, result[0])
  }

  async findByEntityId(entityType: string, entityId: string) {
    const result = await this.db
      .select()
      .from(notes)
      .where(and(eq(notes.entityType, entityType as any), eq(notes.entityId, entityId)))
      .orderBy(desc(notes.createdAt))

    return result.map((note) => parseSchema(NoteSchema, note))
  }

  async findAll() {
    const result = await this.db.select().from(notes).orderBy(desc(notes.createdAt))

    return result.map((note) => parseSchema(NoteSchema, note))
  }
}
