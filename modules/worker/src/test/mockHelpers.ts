import type {JobHelpers} from 'graphile-worker'

export const mockHelpers = {
  logger: {
    info: () => {},
    error: () => {},
  },
  addJob: () => {},
} as unknown as JobHelpers
