import {parseSchema} from '@i/core/schema'

import Debug from 'debug'
import {type Runner, type WorkerUtils, makeWorkerUtils, run} from 'graphile-worker'
import * as v from 'valibot'
import type {WorkerServices} from './Services.js'
import {fetchMarkdown} from './tasks/fetchMarkdown.js'
import {makeBusinessFromSource} from './tasks/makeBusinessFromSource.js'
import {makeBusinessFromSummary} from './tasks/makeBusinessSummary.js'
import {watchMarkdown} from './tasks/watchMarkdown.js'

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
        /** ⬇️ TASK LIST ⬇️ **/
        taskList: {
          makeBusinessFromSource: makeBusinessFromSource(),
          fetchMarkdown: fetchMarkdown(this.#services),
          watchMarkdown: watchMarkdown(this.#services),
          makeBusinessSummary: makeBusinessFromSummary(this.#services),
          makeBusinessFromSummary: makeBusinessFromSummary(this.#services),
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

  async addJob(name: string, payload: any) {
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
