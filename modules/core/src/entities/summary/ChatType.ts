import * as v from 'valibot'

import {ChatMessageSchema, ChatSchema} from './ChatSchema.js'

export type ChatMessageType = v.InferOutput<typeof ChatMessageSchema>
export type ChatType = v.InferOutput<typeof ChatSchema>
