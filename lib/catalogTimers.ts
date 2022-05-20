import { ITimer } from "./context/GlobalContext"


const catalogTimers: ITimer[] = []

const tabata: ITimer = {
	id: "tabata",
	name: "Tabata",
	isDefault: true,
	description: "A fat-burning, fitness-boosting exercise.",
	rounds: 8,
	sequence: [
		{
			id: "1",
			name: "Work",
			description: "20 seconds of flat-out exercise at maximum intensity (pushing yourself to 110%)",
			durationInSeconds: 20
		},
		{
			id: "2",
			name: "Rest",
			description: "10 seconds of rest",
			durationInSeconds: 10
		}
	]
}
catalogTimers.push(tabata)


const emom: ITimer = {
	id: "emom",
	name: "EMOM",
	isDefault: true,
	description: "Every minute on the minute.",
	rounds: 4,
	sequence: [
		{
			id: "1",
			name: "Work",
			description: "20 seconds of flat-out exercise at maximum intensity (pushing yourself to 110%)",
			durationInSeconds: 60
		},
		{
			id: "2",
			name: "Rest",
			description: "10 seconds of rest",
			durationInSeconds: 60
		}
	]
}
catalogTimers.push(emom)


const test: ITimer = {
	id: "test",
	name: "Test",
	isDefault: true,
	description: "A fat-burning, fitness-boosting exercise.",
	rounds: 4,
	sequence: [
		{
			id: "1",
			name: "Work",
			description: "20 seconds of flat-out exercise at maximum intensity (pushing yourself to 110%)",
			durationInSeconds: 3
		},
		{
			id: "2",
			name: "Rest",
			description: "10 seconds of rest",
			durationInSeconds: 5
		}
	]
}
catalogTimers.push(test)

export default catalogTimers