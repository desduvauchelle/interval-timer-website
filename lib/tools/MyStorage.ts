
export const PREFIX = "LIVECASE_SERIES_"

const isNextServer = typeof window === "undefined"

const MyStorage = {
	get(key: string) {
		if (isNextServer) return null
		if (!window) return null
		if (!window.localStorage) return null
		return window.localStorage.getItem(`${PREFIX}${key}`)
	},
	set(key: string, value: Record<string, unknown> | string) { // Record<string, unknown> aka object
		if (isNextServer) return null
		if (!window) return null
		if (!window.localStorage) return null
		let toSave = ""
		if (typeof value === "object") {
			toSave = JSON.stringify(value)
		} else {
			toSave = value + ""
		}
		window.localStorage.setItem(`${PREFIX}${key}`, toSave)
	},
	remove(key: string) {
		if (isNextServer) return null
		if (!window) return null
		if (!window.localStorage) return null
		window.localStorage.removeItem(`${PREFIX}${key}`)
	},
	clear() {
		if (!window) return null
		if (!window.localStorage) return null
		window.localStorage.clear()
	}
}

export const commonStorage = {
	redirectTo: "redirectTo"
}

export default MyStorage