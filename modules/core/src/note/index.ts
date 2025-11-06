import * as v from 'valibot'
import type {NoteCreateSchema, NoteSchema, NoteUpdateSchema} from './NoteSchema.js'

export {type NoteRepository} from './NoteRepository.js'
export * from './NoteRepositoryPostgres.js'
export {newNoteId, NoteCreateSchema, NoteEntityTypeSchema, NoteSchema, NoteUpdateSchema} from './NoteSchema.js'
export {NoteService} from './NoteService.js'

export type NoteType = v.InferOutput<typeof NoteSchema>
export type NoteCreateType = v.InferOutput<typeof NoteCreateSchema>
export type NoteUpdateType = v.InferOutput<typeof NoteUpdateSchema>
