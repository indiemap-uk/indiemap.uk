import {getContext, setContext} from 'svelte'

const locationKey = Symbol('location')

interface MapCenterLocation {
	latitude: number
	longitude: number
}

/**
 * The center of the map location state class
 *
 * Usage:
 *
 * ```ts
 *  const mcs = new MapCenterState()
 *  mcs.location = {latitude: 1, longitude: 1}
 *  console.log(mcs.location)
 * ```
 **/
export class MapCenterState {
	location = $state<MapCenterLocation | null>(null)
}

/**
 * Place the state class into the context:
 *
 * ```ts
 * setMapCenterContext(new UserLocationState())
 * ```
 */
export const setMapCenterContext = (mcs: MapCenterState) => {
	return setContext(locationKey, mcs)
}

/**
 * Get the state class from the context:
 *
 * ```ts
 * const mcs = getMapCenterContext()
 * ```
 */
export const getMapCenterContext = () => {
	return getContext<ReturnType<typeof setMapCenterContext>>(locationKey)
}
