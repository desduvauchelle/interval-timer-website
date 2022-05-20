/*

	AUTH CONTEXT

	Used for:
	- login
	- register
	- forgotten

*/
import React, { createContext, useState, useContext, useEffect } from "react"
import catalogTimers from "../catalogTimers"
import MyStorage from "../tools/MyStorage"


export interface ITimerSequence {
	id: string
	name: string
	description: string
	durationInSeconds: number
}

export interface ITimer {
	id: string
	isDefault: boolean
	name: string
	description: string
	rounds: number
	sequence: ITimerSequence[]
}

export type GlobalContextType = {
	state: {
		timers: ITimer[]
	},
	actions: {
		timerAdd: (timer: ITimer) => void
		timerRemove: (id: string) => void
		timerUpdate: (timer: ITimer) => void
	}
}

const defaultState: GlobalContextType = {
	state: {
		timers: []
	},
	actions: {
		timerAdd: () => { },
		timerRemove: () => { },
		timerUpdate: () => { }
	}
}

export const GlobalContext = createContext(defaultState)

export const GlobalProvider: React.FC<{
	children?: React.ReactNode
}> = ({ children }) => {
	const [timers, setTimers] = useState<ITimer[]>([])
	const [hasFetchedTimers, setHasFetchedTimers] = useState(false)

	//
	// Set the default timers
	//
	React.useEffect(() => {
		if (hasFetchedTimers) return
		setHasFetchedTimers(true)
		const localTimer = MyStorage.get("timers")
		if (!localTimer) return
		try {
			const fetchedTimers = JSON.parse(localTimer)
			setTimers(fetchedTimers)
		} catch (e) {
			console.error(e)
		}
	}, [hasFetchedTimers])

	//
	// On change of timers, save them to local storage
	//
	React.useEffect(() => {
		MyStorage.set("timers", JSON.stringify(timers))
	}, [timers])


	const timerAdd = (timer: ITimer) => {
		setTimers([...timers, timer])
	}

	const timerUpdate = (timer: ITimer) => {
		const index = timers.findIndex(t => t.id === timer.id)
		if (index === -1) return
		const newTimers = [...timers]
		newTimers[index] = timer
		setTimers(newTimers)
	}

	const timerRemove = (id: string) => {
		const index = timers.findIndex(t => t.id === id)
		if (index === -1) return
		const newTimers = [...timers]
		newTimers.splice(index, 1)
		setTimers(newTimers)
	}

	const value: GlobalContextType = {
		actions: {
			timerAdd,
			timerRemove,
			timerUpdate
		},
		state: {
			timers
		}
	}

	return <GlobalContext.Provider value={value}>
		{children}
	</GlobalContext.Provider>
}

export const useGlobalContext = () => {
	const context = useContext(GlobalContext)
	if (context === undefined) {
		throw new Error("useAuthContext must be used within a AuthProvider")
	}
	return context
}