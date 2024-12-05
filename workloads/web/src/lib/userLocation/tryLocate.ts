export const tryLocate = (callback: (lat: number, lon: number) => void) => {
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition((position) => {
			callback(position.coords.latitude, position.coords.longitude)
		})
	}
}
