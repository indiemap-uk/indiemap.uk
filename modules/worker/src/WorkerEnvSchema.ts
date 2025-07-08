import * as v from 'valibot'

export const WorkerEnvSchema = v.object({
  /**
   * The full DB URL, e.g. postgres://indie:indie@localhost:5431/indie?sslmode=disable
   */
  DATABASE_URL: v.string(),
})

export type WorkerEnvType = v.InferOutput<typeof WorkerEnvSchema>
