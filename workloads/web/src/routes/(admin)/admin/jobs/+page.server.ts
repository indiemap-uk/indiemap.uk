import {fail} from '@sveltejs/kit'
import type {Actions} from './$types.js'

export const load = async ({locals}: {locals: App.Locals}) => {
  return {
    jobs: await locals.container.workerService.getJobView(),
  }
}

export const actions: Actions = {
  delete: async ({request, locals}) => {
    const data = await request.formData()
    const jobIdStr = data.get('jobId')

    if (!jobIdStr || typeof jobIdStr !== 'string') {
      return fail(400, {error: 'Invalid job ID'})
    }

    try {
      await locals.container.workerService.deleteJob(jobIdStr)
      return {success: true}
    } catch (error) {
      console.error('Error deleting job:', error)
      return fail(500, {error: 'Failed to delete job'})
    }
  },

  kill: async ({request, locals}) => {
    const data = await request.formData()
    const jobIdStr = data.get('jobId')

    if (!jobIdStr || typeof jobIdStr !== 'string') {
      return fail(400, {error: 'Invalid job ID'})
    }

    try {
      await locals.container.workerService.killJob(jobIdStr)
      return {success: true}
    } catch (error) {
      console.error('Error killing job:', error)
      return fail(500, {error: 'Failed to kill job'})
    }
  },

  fail: async ({locals}) => {
    try {
      await locals.container.workerService.addJob('fail', 'Testing failed jobs')
      return {success: true}
    } catch (error) {
      console.error(error)
      return fail(500)
    }
  },
}
