import * as v from 'valibot'

import {newIdFn} from '../../id/newIdFn.js'
import {TimestampSchema} from '../TimestampSchemas.js'

const noteIdPrefix = 'note'
export const newNoteId = newIdFn(noteIdPrefix)

export const NoteEntityTypeSchema = v.picklist(['source'])

export const NoteSchema = v.object({
  id: v.string(),
  entityType: NoteEntityTypeSchema,
  entityId: v.string(),
  content: v.string(),
  ...TimestampSchema.entries,
})

export const NoteCreateSchema = v.omit(NoteSchema, ['id', 'createdAt', 'updatedAt'])
export const NoteUpdateSchema = v.omit(NoteSchema, ['createdAt', 'updatedAt'])
