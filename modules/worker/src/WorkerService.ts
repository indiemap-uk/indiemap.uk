import {parseSchema} from '@i/core/schema'
import {type WorkerEnvType, WorkerEnvSchema} from './WorkerEnvSchema.js'

import Debug from 'debug'
import {type Runner, type WorkerUtils, makeWorkerUtils, run} from 'graphile-worker'

const debug = Debug('indie:worker:WorkerService')

export class WorkerService {
  #dbUrl: string
  #runner?: Runner
  #utils?: WorkerUtils

  constructor(env: WorkerEnvType) {
    const {DATABASE_URL} = parseSchema(WorkerEnvSchema, env)

    this.#dbUrl = DATABASE_URL
  }

  async start() {
    if (this.#runner) {
      return
    }

    try {
      this.#runner = await run({
        connectionString: this.#dbUrl,
        taskList: {
          hello: async (payload: any, helpers) => {
            const {name} = payload
            helpers.logger.info(`Hello, ${name}`)
          },
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
