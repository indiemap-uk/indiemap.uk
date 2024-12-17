import {isInsideUK} from '$lib/map/UK'

/**
 * Tries to get the coordinates from the user's browser.
 * If the browser does not support geolocation, nothing happens.
 * If the user is outside the UK, nothing happens, as we don't want to center the map on a random country
 * This is not a Google Maps replacement :)
 */
export const tryLocateInUK = (callback: (lat: number, lon: number) => void) => {
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition((position) => {
			if (!isInsideUK(position.coords.latitude, position.coords.longitude)) {
				return
			}

			callback(position.coords.latitude, position.coords.longitude)
		})
	}
}
