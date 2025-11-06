import type {Logger as CoreLogger} from '#logger/index.js'
import {parseSchema} from '#schema/index.js'

import Debug from 'debug'
import {type Runner, type WorkerUtils, Logger as GraphileLogger, makeWorkerUtils, run} from 'graphile-worker'
import * as v from 'valibot'
import type {TaskDeps} from './TaskDeps.js'
import {type TaskName, tasks} from './tasks/index.js'

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
  #services: TaskDeps
  #logger: CoreLogger

  constructor(env: WorkerEnvType, s: TaskDeps) {
    const {DATABASE_URL} = parseSchema(WorkerEnvSchema, env)

    this.#dbUrl = DATABASE_URL
    this.#services = s
    this.#logger = s.logger
  }

  async start() {
    if (this.#runner) {
      return
    }

    try {
      this.#runner = await run({
        connectionString: this.#dbUrl,
        noPreparedStatements: true,
        logger: new GraphileLogger(this.#logFactory()),
        /** ⬇️ TASK LIST ⬇️ **/
        taskList: {
          makeBusinessFromSource: tasks.makeBusinessFromSource(this.#services),
          fetchMarkdown: tasks.fetchMarkdown(this.#services),
          watchMarkdown: tasks.watchMarkdown(this.#services),
          makeBusinessSummary: tasks.makeBusinessFromSummary(this.#services),
          makeBusinessFromSummary: tasks.makeBusinessFromSummary(this.#services),
          makeSourceFromUrl: tasks.makeSourceFromUrl(this.#services),
          fail: tasks.fail(),
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
			if (this.#runner) {
				await this.#runner.stop()
			}

			if (this.#utils) {
				await this.#utils.release()
			}

    } catch (error: unknown) {
      console.error(`Error stopping worker in WorkerService`)
      throw error
    }
  }

  #logFactory() {
    return (scope: any) => {
      const scopedLogger = this.#logger.child({service: 'WorkerService', scope})

      return (level: string, message: string, meta?: {[key: string]: unknown}) => {
        switch (level) {
          case 'error':
            scopedLogger.error(meta, message)
            break
          case 'warn':
            scopedLogger.error(meta, message)
            break
          case 'info':
            scopedLogger.info(meta, message)
            break
          case 'debug':
            scopedLogger.debug(meta, message)
            break
          default:
            scopedLogger.info(meta, message)
        }
      }
    }
  }
}
