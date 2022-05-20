import { faArrowLeft, faMinus, faPause, faPlay, faPlus, faRefresh, faStop } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import catalogTimers from '../lib/catalogTimers'
import { GlobalProvider, ITimer, useGlobalContext } from '../lib/context/GlobalContext'
import useTimer from '../lib/hooks/useTimer'
import secondsToDisplay from '../lib/tools/secondsToDisplay'


const Timer: NextPage = () => {
	const [timer, setTimer] = React.useState<ITimer | null>(null)
	const router = useRouter()
	const id = router.query.id as string
	const globalContext = useGlobalContext()
	const { timers } = globalContext.state
	const { start, pause, resume, stop, reset, isRunning, remainingTime, isFinished, isPaused, remainingPercentage, status } = useTimer(timer)

	React.useEffect(() => {
		if (!id) return
		const timer = timers.find(t => t.id === id)
		if (timer) {
			setTimer(timer)
			return
		}
		const timerDefault = catalogTimers.find(t => t.id === id)
		if (timerDefault) {
			setTimer(timerDefault)
			return
		}
	}, [id, timer, timers])

	if (!timer) {
		return <div>
			<Head>
				<title>Timer</title>
			</Head>
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-4xl">Timer</h1>
				<p className="text-xl">Timer not found</p>
			</div>
		</div>
	}

	return <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-indigo-400 text-white">
		<Head>
			<title>Interval Training clock</title>
			<meta name="description" content="Interval training app" />
			<link rel="icon" href="/favicon.ico" />
		</Head>

		<div className="flex flex-col min-h-screen">
			<div className="relative">
				<div className="absolute top-2 left-0">
					<Link href="/">
						<a className="text-2xl p-4"><FontAwesomeIcon icon={faArrowLeft} /></a>
					</Link>
				</div>
				<h1 className="h1 text-center">{timer.name}</h1>
			</div>

			<div className="flex-grow flex flex-row items-center">
				<div className="pl-4">
					{status && <>
						{status.map(sequence => {
							return <div key={sequence.id} className="flex flex-row items-center justify-center py-2 text-xl border-b border-slate-200/50">
								<div className="mr-4 w-6 text-xl">
									{(isRunning && sequence.isCurrent) && <FontAwesomeIcon icon={faPlay} />}
								</div>
								<span className="mr-2 w-6">{sequence.roundsCompleted}<span className="text-sm">x</span></span>
								<span className="mr-2 w-14">{sequence.durationInSeconds}s</span>
								<span className="mr-2">{sequence.name}</span>
							</div>
						})}
					</>}
				</div>
				<div className="flex-grow flex flex-col items-center justify-center">
					<div className="max-w-xl">
						{!isRunning && <>
							<button
								onClick={start}
								className="aspect-square text-4xl text-white border-8 font-extrabold border-white rounded-full px-6">
								<FontAwesomeIcon icon={faPlay} />
							</button>
						</>}
						{isRunning && <>
							{isFinished && <div className="text-center">
								<p className="text-4xl font-extrabold pb-4">Finished!</p>
								<button
									onClick={reset}
									className="aspect-square text-4xl text-white border-8 font-extrabold border-white rounded-full px-6">
									<FontAwesomeIcon icon={faRefresh} />
								</button>
							</div>}
							{!isFinished && <div className="text-center w-64">
								<p className="text-8xl font-extrabold pb-4">{secondsToDisplay(remainingTime)}</p>

								<div className="w-full rounded-full h-6 bg-white/30 overflow-hidden mb-4">
									<div className="h-full rounded-full transition-all duration-500 ease-linear bg-green-400" style={{ width: remainingPercentage + "%" }}></div>
								</div>

								<div className="flex flex-row items-center justify-center">
									<div className="mr-2">
										{!isPaused && <button
											onClick={pause}
											className="aspect-square text-2xl text-white border-4 font-extrabold border-white rounded-full px-6">
											<FontAwesomeIcon icon={faPause} />
										</button>}
										{isPaused && <button
											onClick={resume}
											className="aspect-square text-2xl text-white border-4 font-extrabold border-white rounded-full px-6">
											<FontAwesomeIcon icon={faPlay} />
										</button>}
									</div>
									<div>
										<button
											onClick={stop}
											className="aspect-square text-2xl text-white border-4 font-extrabold border-white rounded-full px-6">
											<FontAwesomeIcon icon={faStop} />
										</button>
									</div>
								</div>
							</div>}
						</>}
					</div>
				</div>
			</div>

		</div>

	</div>

}

const TimerWrapper: React.FC = () => {
	return <GlobalProvider>
		<Timer />
	</GlobalProvider>
}
export default TimerWrapper
