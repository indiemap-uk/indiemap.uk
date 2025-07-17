import type {Task} from 'graphile-worker'

/** Fail is for testing only. It always fails. */
export const fail = (): Task => async (payload, helpers) => {
  helpers.logger.error(`This job always fails. Payload is: ${payload}`)

  throw new Error(`This job always fails. Payload is ${payload}`)
}
