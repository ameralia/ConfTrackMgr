export default function outputTracks(finalRes, resultElem, talkes, tracksNum, error) {
	for (let i = 0; i < tracksNum; i++) {
		const outputList = document.createElement("ul");
		const trackHead = document.createElement("h3");
		trackHead.textContent = `Track #${i + 1}`;
		outputList.append(trackHead);
		if (finalRes) {
			talkes?.forEach(talk => {
				if (talk.sessionId == i * 2 || talk.sessionId == (i * 2) + 1) {
					if(talk.startTime == "13:00") {
						fillListItem(outputList, "12:00 Lunch")
					}
					const duration = (talk.duration == 5)? "lightning" : `${talk.duration}min`
					fillListItem(outputList, `${talk.startTime} ${talk.title}: ${duration}`);
				}
			});
			fillListItem(outputList, `17:00 Networking Event`);
		} else {
			outputList.textContent = error;
		}
		resultElem.append(outputList);
	}	
}

function fillListItem(parentElem, data) {
	const listItem = document.createElement("li");
	listItem.textContent = data;
	parentElem.append(listItem);
}