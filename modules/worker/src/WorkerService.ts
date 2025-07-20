import {parseSchema} from '@i/core/schema'

import Debug from 'debug'
import {type Runner, type WorkerUtils, makeWorkerUtils, run} from 'graphile-worker'
import * as v from 'valibot'
import type {WorkerServices} from './Services.js'
import {type TaskName, taks} from './tasks/index.js'

const WorkerEnvSchema = v.object({
  /**
   * The full DB URL, e.g. postgres://indie:indie@localhost:5431/indie?sslmode=disable
   */
  DATABASE_URL: v.string(),
})

type WorkerEnvType = v.InferOutput<typeof WorkerEnvSchema>

const debug = Debug('indie:worker:WorkerService')

export class WorkerService {
  #dbUrl: string
  #runner?: Runner
  #utils?: WorkerUtils
  #services: WorkerServices

  constructor(env: WorkerEnvType, s: WorkerServices) {
    const {DATABASE_URL} = parseSchema(WorkerEnvSchema, env)

    this.#dbUrl = DATABASE_URL
    this.#services = s
  }

  async start() {
    if (this.#runner) {
      return
    }

    try {
      this.#runner = await run({
        connectionString: this.#dbUrl,
        noPreparedStatements: true,
        /** ⬇️ TASK LIST ⬇️ **/
        taskList: {
          makeBusinessFromSource: taks.makeBusinessFromSource(this.#services),
          fetchMarkdown: taks.fetchMarkdown(this.#services),
          watchMarkdown: taks.watchMarkdown(this.#services),
          makeBusinessSummary: taks.makeBusinessFromSummary(this.#services),
          makeBusinessFromSummary: taks.makeBusinessFromSummary(this.#services),
          makeSourceFromUrl: taks.makeSourceFromUrl(this.#services),
          fail: taks.fail(),
        },
      })

      this.#runner.promise.catch(error => {
        console.error(`WorkerService runner failuire: ${error}`)
      })
    } catch (error: unknown) {
      console.error(`Error starting worker in WorkerService`)
      throw error
    }

    try {
      this.#utils = await makeWorkerUtils({connectionString: this.#dbUrl})
    } catch (error: unknown) {
      console.error(`Error creating worker utils in WorkerService`)
      throw error
    }
  }

  async addJob(name: TaskName, payload: any) {
    debug(`Adding job "${name}"`)

    if (!this.#runner) {
      throw new Error('Worker not started (no runner)')
    }

    try {
      return await this.#runner.addJob(name, payload)
    } catch (error: unknown) {
      console.error(`Error adding job "${name}" in WorkerService`)
      throw error
    }
  }

  async getJobView() {
    if (!this.#utils) {
      throw new Error('Worker utils not initialized')
    }

    const result = await this.#utils.withPgClient(async pgClient => {
      const query = `
        SELECT *
        FROM graphile_worker.jobs
        ORDER BY created_at DESC
      `

      return await pgClient.query(query)
    })

    return result.rows
  }

  async deleteJob(jobId: string) {
    if (!this.#utils) {
      throw new Error('Worker utils not initialized')
    }

    try {
      const updatedJobs = await this.#utils.completeJobs([jobId])
      debug(`Deleted job ${jobId}`)
      return updatedJobs
    } catch (error: unknown) {
      console.error(`Error deleting job ${jobId} in WorkerService`)
      throw error
    }
  }

  async killJob(jobId: string) {
    if (!this.#utils) {
      throw new Error('Worker utils not initialized')
    }

    try {
      const updatedJobs = await this.#utils.permanentlyFailJobs([jobId], 'Manually killed by admin')
      debug(`Killed job ${jobId}`)
      return updatedJobs
    } catch (error: unknown) {
      console.error(`Error killing job ${jobId} in WorkerService`)
      throw error
    }
  }

  async stop() {
    try {
      this.#runner && await this.#runner.stop()
      this.#utils && await this.#utils.release()
    } catch (error: unknown) {
      console.error(`Error stopping worker in WorkerService`)
      throw error
    }
  }
}
