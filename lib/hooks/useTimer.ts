import React from "react"
import { ITimer, ITimerSequence } from "../context/GlobalContext"
import useInterval, { IUserInterval } from "./useInterval"

interface UserTimerReturn extends IUserInterval {
	status: ITimerStatus[] | null
}


interface ITimerStatus extends ITimerSequence {
	isCurrent: boolean
	roundsCompleted: number
}

const useTimer = (givenTimer: ITimer | null): UserTimerReturn => {
	const [timer, setTimer] = React.useState<ITimer | null>()
	const [status, setStatus] = React.useState<ITimerStatus[] | null>(null)
	const [currentDuration, setCurrentDuration] = React.useState(0)
	const [isFinished, setIsFinished] = React.useState<boolean | null>(null)

	const onComplete = () => {
		if (!timer) return
		if (status === null) return
		if (status.length === 0) return
		let currentIndex = 0
		for (let i = 0; i < status.length; i++) {
			if (status[i].isCurrent) {
				currentIndex = i
				status[i].isCurrent = false
				status[i].roundsCompleted = status[i].roundsCompleted + 1
				break
			}
		}
		let updateToIndex = currentIndex + 1
		if (updateToIndex === status.length) {
			updateToIndex = 0
		}
		status[updateToIndex].isCurrent = true

		// If we're on the last round, we're done
		const roundsToComplete = timer.rounds
		if (status.filter(s => s.roundsCompleted === roundsToComplete).length === status.length) {
			setIsFinished(true)
			return
		}

		setStatus(status)
		setCurrentDuration(status[updateToIndex].durationInSeconds)
	}
	const interval = useInterval(currentDuration, onComplete)


	// Set the timer on timer change
	React.useEffect(() => {
		// setDuration(desiredDuration)
		if (!givenTimer && timer) {
			setTimer(null)
			return
		}
		if (givenTimer && timer) {
			if (timer.id !== givenTimer.id) {
				setStatus(null)
				setTimer(givenTimer)
				return
			}
		}
		if (!timer && givenTimer) {
			setTimer(givenTimer)
			setStatus(null)
			return
		}
	}, [givenTimer, timer])

	//
	// Set the status on timer change
	//
	React.useEffect(() => {
		if (!timer) return
		if (status) return
		if (!timer.sequence) return
		if (!timer.sequence.length) return

		// Got to loop through the sequence and check the status
		if (!status) {
			const currentIndex = 0
			const newStatus: ITimerStatus[] = []
			timer.sequence.forEach((sequenceItem, index) => {
				newStatus.push({
					...sequenceItem,
					isCurrent: index === 0 ? true : false,
					roundsCompleted: 0
				})
			})
			setStatus(newStatus)
			setCurrentDuration(newStatus[currentIndex].durationInSeconds)
			return
		}
	}, [status, timer])

	const onReset = () => {
		interval.reset()
		setStatus(null)
		setIsFinished(false)
	}


	return {
		...interval,
		reset: onReset,
		isFinished,
		status
	}

}

export default useTimer