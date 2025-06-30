import * as v from 'valibot'

export const EnvSchema = v.object({
  DATABASE_URL: v.string(),
  JINA_API_KEY: v.string(),
  OPENAI_API_KEY: v.string(),
})
