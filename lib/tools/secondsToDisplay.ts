

const secondsToDisplay = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60)
	const secondsRemaining = seconds % 60
	return `${minutes}:${secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}`
}

export default secondsToDisplay