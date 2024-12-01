import {getContext, setContext} from 'svelte'

const locationKey = Symbol('location')

interface UserLocation {
	latitude: number
	longitude: number
}

/**
 * The user location state class
 *
 * Usage:
 *
 * ```ts
 *  const uls = new UserLocationState()
 *  uls.location = {latitude: 1, longitude: 1}
 *  console.log(uls.location)
 * ```
 **/
export class UserLocationState {
	location = $state<null | UserLocation>(null)
}

/**
 * Place the state class into the context:
 *
 * ```ts
 * setUserLocationContext(new UserLocationState())
 * ```
 */
export const setUserLocationContext = (uls: UserLocationState) => {
	return setContext(locationKey, uls)
}

/**
 * Get the state class from the context:
 *
 * ```ts
 * const uls = getUserLocationContext()
 * // See UserLocationState for usage
 * ```
 */
export const getUserLocationContext = () => {
	return getContext<ReturnType<typeof setUserLocationContext>>(locationKey)
}
