const minSessionTime = 180,
	maxSessionTime = 240;
export default function getTracks(talkes, tracksNum, sum) {
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
