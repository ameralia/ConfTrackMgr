export function parseToObj(data) {
	const replaceFrom = "lightning";
	const replaceTo = "5min";
	const regex = /\d+/g;
	let result = [];

	data = data.replaceAll(replaceFrom, replaceTo);
	let lines = data.split("\n");
	lines = lines.filter((line) => line != "");

	lines.forEach((line, i) => {
		result.push({
			id: i,
			title: line.slice(0, line.search(regex)),
			duration: parseInt(line.match(regex)),
			sessionId: null,
			startTime: 0,
		});
	});
	if(result.find(elem => ! elem.duration)) {
		return false;
	}

	result.forEach((elem) => {
		while (elem.title.indexOf(" ") == 0) {
			elem.title = elem.title.slice(1);
		}
		while (elem.title.lastIndexOf(" ") == elem.title.length - 1) {
			elem.title = elem.title.slice(0, elem.title.length - 1);
		}
	});
	return result;
}

export function countTracks(sum, min, max) {
	let res = 1;
	if (sum / max > 1) {
		res += Math.floor(sum / max);
		if ((sum % max) / min > 1) res++;
	}
	return res;
}