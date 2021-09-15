"use strict";
import convertTime from './timeUtils';
import { parseToObj } from './parsing';
import { countTracks } from './parsing';
import getTracks from './distributeTalks';
import outputTracks from './output';

const dataElem = document.querySelector("#data");
const enterBtn = document.querySelector("#btn");
const resultElem = document.querySelector(".result"),
	MIN_TRACK_DURATION = 360,
	MAX_TRACK_DURATION = 420,
	ERROR_MESSAGE = "Data input error!";

enterBtn.addEventListener("click", (e) => {
	e.stopPropagation;
	const userData = dataElem.value;
	const parsedData = parseToObj(userData);
	if(parsedData) {
		let summaryTime = 0,
			tracksNum = 0;
		resultElem.innerHTML = "";
		parsedData.sort((a, b) => b.duration - a.duration);

		parsedData.forEach((speech) => {
			summaryTime += speech.duration;
		});

		tracksNum = countTracks(summaryTime, MIN_TRACK_DURATION, MAX_TRACK_DURATION);

		const talkes = parsedData.map((a) => ({ ...a }));
		const finalRes = getTracks(talkes, tracksNum, summaryTime);

		talkes?.sort((a, b) => a.sessionId - b.sessionId);
		convertTime(talkes);
		outputTracks(finalRes, resultElem, talkes, tracksNum, ERROR_MESSAGE);
	}
	else {
		resultElem.textContent = ERROR_MESSAGE;
	}
});

