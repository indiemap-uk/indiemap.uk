import type {Container} from './mock.js'

// Checks a few preconditions, e.g. if town data is populated
export const check = async (container: Container) => {
  const randomTown = await container.townService.getRandom()
  if (!randomTown) {
    throw new Error('No towns found. See the README about importing UK town data')
  }
}
