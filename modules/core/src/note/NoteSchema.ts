import * as v from 'valibot'

import {TimestampSchema} from '#schema/TimestampSchemas.js'
import {newIdFn} from '#schema/newIdFn.js'

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
