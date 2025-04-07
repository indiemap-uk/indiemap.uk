import type {getContainer} from './getContainer'

export type AppContainer = Awaited<ReturnType<typeof getContainer>>
