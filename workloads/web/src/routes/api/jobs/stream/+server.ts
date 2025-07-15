import {isAdminEmail} from '$lib/authZ/isAdminEmail'
import {error} from '@sveltejs/kit'
import type {RequestHandler} from './$types.js'

export const GET: RequestHandler = async ({locals}) => {
  // Check if user is admin
  const session = await locals.auth()
  const isAdminUser = isAdminEmail(
    locals.env.ADMIN_USER_EMAILS,
    session?.user.email,
  )

  if (!isAdminUser) {
    throw error(403, 'Forbidden')
  }
  const stream = new ReadableStream({
    start(controller) {
      const sendJobsUpdate = async () => {
        try {
          const jobs = await locals.container.workerService.getJobView()
          const data = `data: ${JSON.stringify(jobs)}\n\n`
          controller.enqueue(new TextEncoder().encode(data))
        } catch (error) {
          console.error('Error fetching jobs:', error)
        }
      }

      // Send initial data
      sendJobsUpdate()

      // Send updates every 5 seconds
      const interval = setInterval(sendJobsUpdate, 5000)

      // Cleanup when client disconnects
      return () => {
        clearInterval(interval)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
}
