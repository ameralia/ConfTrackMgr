"use strict";

const dataElem = document.querySelector("#data");
const enterBtn = document.querySelector("#btn");
const resultElem = document.querySelector(".result");
const minSessionTime = 180,
	maxSessionTime = 240,
	MIN_TRACK_DURATION = 360,
	MAX_TRACK_DURATION = 420;

enterBtn.addEventListener("click", (e) => {
	e.stopPropagation;
	const userData = dataElem.value;
	const parsedData = parseToObj(userData);
	let summaryTime = 0,
		tracksNum = 0;
	resultElem.innerHTML = "";
	parsedData.sort((a, b) => b.duration - a.duration);
	//const parsedDataStr = JSON.stringify(parsedData);
	//console.log(parsedDataStr);

	parsedData.forEach((speech) => {
		summaryTime += speech.duration;
	});

	tracksNum = countTracks(summaryTime, MIN_TRACK_DURATION, MAX_TRACK_DURATION);

	//distribute time into tracks
	const talkes = parsedData.map((a) => ({ ...a }));
	const finalRes = getTracks(talkes, tracksNum, summaryTime);
	talkes?.sort((a, b) => a.sessionId - b.sessionId);
	convertTime(talkes);
	for (let i = 0; i < tracksNum; i++) {
		const outputList = document.createElement("ul");
		const trackHead = document.createElement("h3");
		trackHead.textContent = `Track #${i + 1}`;
		outputList.append(trackHead);
		if (finalRes) {
			talkes?.forEach((talk, j) => {
				if (talk.sessionId == i * 2 || talk.sessionId == (i * 2) + 1) {
					const listItem = document.createElement("li");
					listItem.textContent = `${talk.startTime}: ${talk.title}: ${talk.duration}min`;
					outputList.append(listItem);
				}
			});
		} else {
			outputList.textContent = "Error";
		}
		resultElem.append(outputList);
	}
	
});

function convertTime(talkes) {
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

function parseToObj(data) {
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

function countTracks(sum, min, max) {
	let res = 1;
	if (sum / max > 1) {
		res += Math.floor(sum / max);
		if ((sum % max) / min > 1) res++;
	}
	return res;
}

function getTracks(talkes, tracksNum, sum) {
	const sessionsNum = tracksNum * 2,
		count = Math.floor(talkes.length / sessionsNum),
		startIndex = 0,
		durationSums = [];
	if (sum < minSessionTime * sessionsNum) {
		return false;
	}
	for (let i = 0; i < sessionsNum; i++) {
		durationSums[i] = 0;
	}
	const finalRes = getTalkesPart(talkes, startIndex, count, durationSums);
	console.log(finalRes ? JSON.stringify(talkes) : "Nope.");
	return finalRes;
}

function getTalkesPart(talkes, startIndex, count, durationSums) {
	const sessionsNum = durationSums.length;
	const numIter = Math.pow(sessionsNum, count);
	for (let i = 0; i < numIter; i++) {
		let x = i;
		for (let j = startIndex; j < startIndex + count; j++) {
			const rem = x % sessionsNum;
			talkes[j].sessionId = rem;
			x = Math.round((x - rem) / sessionsNum);
		}
		const curDurationSums = checkTalkes(
			talkes,
			startIndex,
			count,
			durationSums
		);
		if (curDurationSums) {
			console.log(
				`startIndex: ${startIndex}, count: ${count}, curDurationSums: ${curDurationSums}.`
			);

			if (startIndex + count === talkes.length) {
				return true;
			}

			const newStartIndex = startIndex + count;
			const newCount =
				talkes.length - newStartIndex < count
					? talkes.length - newStartIndex
					: count;
			if (getTalkesPart(talkes, newStartIndex, newCount, curDurationSums)) {
				return true;
			}
		}
	}
	return false;
}

function checkTalkes(talkes, startIndex, count, durationSums) {
	const curDurationSums = [...durationSums],
		sessionsNum = durationSums.length;
	for (let i = 0; i < sessionsNum; i++) {
		let durationSum = curDurationSums[i];
		for (let j = startIndex; j < startIndex + count; j++) {
			if (talkes[j].sessionId == i) {
				talkes[j].startTime = durationSum;
				durationSum += talkes[j].duration;
				if (!(i % 2)) {
					if (durationSum > minSessionTime) {
						return null;
					}
				} else {
					if (durationSum > maxSessionTime) {
						return null;
					}
				}
			}
		}
		curDurationSums[i] = durationSum;
		if (startIndex === talkes.length - count) {
			//console.log(`curDurationSums: ${curDurationSums}, talkes: ${talkes.map(t => t.sessionId)}.`);
			if (!(i % 2)) {
				if (durationSum != minSessionTime) {
					return null;
				}
			} else {
				if (durationSum > maxSessionTime || durationSum < minSessionTime) {
					return null;
				}
			}
		}
	}
	return curDurationSums;
}

