import { faMinus, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import catalogTimers from '../lib/catalogTimers'
import { GlobalProvider, ITimer, useGlobalContext } from '../lib/context/GlobalContext'
import generateRandomString from '../lib/tools/generateRandomString'


const TimerDisplay: React.FC<{
	timer: ITimer,
	timerAdd?: (timer: ITimer) => void,
	timerRemove?: (id: string) => void,
}> = ({ timer, timerAdd, timerRemove }) => {
	const router = useRouter()

	return <div className="flex flex-row items-center mb-2 px-4 py-2 bg-slate-500/20 hover:bg-slate-500/40 rounded-2xl transition-all duration-500 ease-in">
		<div className="mr-4">
			<button
				onClick={(e) => {
					e.preventDefault()
					router.push(`/timer?id=${timer.id}`)
				}}
				className="w-12 h-12 bg-white rounded-full text-indigo-500 flex flex-row items-center justify-center text-xl">
				<FontAwesomeIcon icon={faPlay} />
			</button>
		</div>
		<div className="flex-grow">
			<strong>{timer.name}</strong>
			<p>{timer.description}</p>
			<p>{timer.rounds}<span className='text-xs'>x</span> {timer.sequence.map(s => s.durationInSeconds).join("-")}</p>
		</div>
		{timerAdd !== undefined && <div className="flex flex-row items-center justify-center ml-4">
			<button
				onClick={(e) => {
					e.preventDefault()
					timerAdd({
						...timer,
						id: generateRandomString(),
						isDefault: false
					})
				}}
				className="w-12 h-12  rounded-full text-white border border-white flex flex-row items-center justify-center text-xl">
				<FontAwesomeIcon icon={faPlus} />
			</button>
		</div>}
		{timerRemove !== undefined && <div className="flex flex-row items-center justify-center ml-4">
			<button
				onClick={(e) => {
					e.preventDefault()
					const conf = window.confirm(`Are you sure you want to remove the timer "${timer.name}"?`)
					if (!conf) return
					timerRemove(timer.id)
				}}
				className="w-12 h-12  rounded-full text-white border border-white flex flex-row items-center justify-center text-xl">
				<FontAwesomeIcon icon={faMinus} />
			</button>
		</div>}
	</div>
}

const Home: NextPage = () => {
	const globalContext = useGlobalContext()
	const { timers } = globalContext.state
	const { timerAdd, timerRemove } = globalContext.actions

	return <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-indigo-400 text-white">
		<Head>
			<title>Interval Training clock</title>
			<meta name="description" content="Interval training app" />
			<link rel="icon" href="/favicon.ico" />
		</Head>

		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="h1">Interval Training Clock</h1>
			<p className="h1-sub">Your solution to timers</p>

			<div className="max-w-lg mt-10">
				{timers.length > 0 && <>
					<h2 className="h2 pt-14 pb-4">Your timers</h2>
					{timers.map(timer => {
						return <TimerDisplay key={timer.id} timer={timer} timerRemove={timerRemove} />
					})}
				</>}


				<h2 className="h2 pt-14 pb-4">Common timers</h2>
				{catalogTimers.map(timer => {
					return <TimerDisplay key={timer.id} timer={timer} timerAdd={timerAdd} />
				})}
			</div>
		</div>

	</div>

}

const HomeWrapper: React.FC = () => {
	return <GlobalProvider>
		<Home />
	</GlobalProvider>
}
export default HomeWrapper
