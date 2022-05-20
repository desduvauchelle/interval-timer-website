import React from 'react'


export interface IUserInterval {
	start: () => void
	pause: () => void
	resume: () => void
	stop: () => void
	reset: () => void
	isRunning: boolean
	elapsedTime: number
	remainingTime: number
	percentage: number
	isFinished: boolean | null
	isPaused: boolean
	remainingPercentage: number
}

const useInterval = (givenDuration: number, onComplete: () => void): IUserInterval => {
	const [isRunning, setIsRunning] = React.useState(false)
	const [isPaused, setIsPaused] = React.useState(false)
	const [isFinished, setIsFinished] = React.useState<boolean | null>(null)
	const [duration, setDuration] = React.useState(0)
	const [elapsedTime, setElapsedTime] = React.useState(0)
	const timerRef = React.useRef<number | null>(null)
	const soundRef = React.useRef<HTMLAudioElement | null>(null)
	const endSoundRef = React.useRef<HTMLAudioElement | null>(null)

	// Load the sound
	React.useEffect(() => {
		if (!soundRef.current) {
			const audio = new Audio("/beep.mp3")
			audio.volume = 0.5
			soundRef.current = audio
		}
		if (!endSoundRef.current) {
			const audio = new Audio("/gong.wav")
			audio.volume = 0.5
			endSoundRef.current = audio
		}
	}, [])

	// On change of given duration
	React.useEffect(() => {
		console.log(`Setting duration to ${givenDuration}`)
		setDuration(givenDuration)
		setElapsedTime(0)
		setIsFinished(false)
	}, [givenDuration])


	// On change of running start/stop timer
	React.useEffect(() => {
		if (duration === 0) return
		if (isFinished) return
		if (!isRunning || isPaused) {
			if (timerRef.current) {
				clearInterval(timerRef.current)
				timerRef.current = null
			}
			return
		}

		const secondsBeep = (isEnd: boolean) => {
			if (isEnd) {
				if (!endSoundRef.current) return
				if (soundRef.current) {
					soundRef.current.pause()
					soundRef.current.currentTime = 0
				}
				endSoundRef.current.currentTime = 0
				endSoundRef.current.play()
				return
			}
			if (!soundRef.current) return
			if (endSoundRef.current) {
				endSoundRef.current.pause()
				endSoundRef.current.currentTime = 0
			}
			soundRef.current.currentTime = 0.8
			soundRef.current.play()
		}

		timerRef.current = window.setInterval(() => {
			const newElapsedTime = elapsedTime + 1
			if (newElapsedTime > duration) {

				secondsBeep(true)
				setIsFinished(true)
				setElapsedTime(duration)
				onComplete()
				return
			}
			setElapsedTime(elapsedTime + 1)
			if (duration - elapsedTime + 1 <= 3) {
				secondsBeep(false)
			}
		}, 1000)
		return () => {
			if (timerRef.current) {
				window.clearInterval(timerRef.current)
			}
		}

	}, [isRunning, elapsedTime, isPaused, duration, isFinished, onComplete])



	// if (duration > 0) {
	// 	console.log(`Timer duration: ${duration}, elapsed time: ${elapsedTime} and remaining percentage ${duration > 0 ? (duration - elapsedTime) / duration * 100 : 0}`)
	// }

	return {
		start: () => {
			setIsRunning(true)
		},
		pause: () => {
			setIsPaused(true)
		},
		resume: () => {
			setIsPaused(false)
		},
		stop: () => {
			setIsRunning(false)
		},
		reset: () => {
			setIsRunning(false)
			setElapsedTime(0)
		},
		isRunning,
		isPaused,
		elapsedTime,
		remainingTime: duration - elapsedTime,
		isFinished: isFinished,
		percentage: duration > 0 ? elapsedTime / duration * 100 : 0,
		remainingPercentage: duration > 0 ? (duration - elapsedTime) / duration * 100 : 0
	}
}

export default useInterval