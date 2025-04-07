import * as v from 'valibot'

import {AnswerSchema} from './AnswerSchema.js'

export type AnswerType = v.InferOutput<typeof AnswerSchema>
