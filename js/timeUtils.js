export default function convertTime(talkes) {
	const MINS = 60;
	talkes.forEach(talk => {
		const hours = Math.floor(talk.startTime / MINS) + ((talk.sessionId % 2) ? 13 : 9);
		const mins = talk.startTime % MINS;
		talk.startTime = `${formatTime(hours)}:${formatTime(mins)}`;
	});
}

function formatTime(val) {
	return (val < 10) ? `0${val}` : val;
}