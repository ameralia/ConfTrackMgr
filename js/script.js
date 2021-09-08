'use strict';

const dataElem = document.querySelector('#data');
const enterBtn = document.querySelector('#btn');
const resultElem = document.querySelector('.result');
const minSessionTime = 180,
    maxSessionTime = 240;
let parsedData,
    summaryTime = 0,
    tracksNum = 0,
    tracks = [];
const MIN_TRACK_DURATION = 360,
    MAX_TRACK_DURATION = 420;

enterBtn.addEventListener('click', (e) => {
    e.stopPropagation;
    const userData = dataElem.value;
    parsedData = parseToObj(userData);

    parsedData.forEach(speech => {
        summaryTime += speech.duration;
    });

    tracksNum = countTracks(summaryTime, MIN_TRACK_DURATION, MAX_TRACK_DURATION);

    //distribute time into tracks
    const talkes = parsedData.map(a => ({...a}));
    tracks = getTracks(talkes, tracksNum);
    //console.log(tracks);

    //output result
    const outputList = document.createElement('ul');
    tracks?.forEach(track => {
        const listItem = document.createElement('li');
        listItem.textContent = `Session${track.sessionId}: ${track.startTime}: ${track.title}, duration: ${track.duration}`
        outputList.append(listItem);
    });
        
    resultElem.append(outputList);
});

function parseToObj(data) {
    const replaceFrom = 'lightning';
    const replaceTo = '5min';
    const regex = /\d+/g;
    let result = [];

    data = data.replaceAll(replaceFrom, replaceTo);
    let lines = data.split('\n');
    lines = lines.filter(line => line != '');

    lines.forEach((line, i) => {
        result.push({
            id: i,
            title: line.slice(0, line.search(regex)),
            duration: parseInt(line.match(regex)),
            sessionId: '',
            startTime: 0
        })
    });

    result.forEach(elem => {
        while (elem.title.indexOf(' ') == 0) {
            elem.title = elem.title.slice(1);
        }
        while (elem.title.lastIndexOf(' ') == elem.title.length - 1) {
            elem.title = elem.title.slice(0, elem.title.length - 1);
        }
    });

    return result;
}

function countTracks(sum, min, max) {
    let res = 1;
    if(sum / max > 1) {
        res += Math.floor(sum / max);
        if((sum % max) / min > 1)
            res ++;
    }
    return res;
}

function getTracks(talkes, tracksNum) {
    const sessionsNum = tracksNum * 2,
        numIter = Math.pow(sessionsNum, talkes.length);
        for(let i=0; i < numIter; i++) {
            let x = i;
            talkes.forEach(talk => {
                talk.sessionId = x % sessionsNum;
                    x = Math.floor(x / sessionsNum);     
            }); 
            if(checkTalkes(talkes, sessionsNum)){
                return talkes;
                //console.log(JSON.stringify(talkes));
            }
                
        }
}

function checkTalkes(talkes, sessionsNum) {
    //check if all sessionIds are not equal
    let checkEqual = false;
    for(let i = 0; i < talkes.length; i++) {
        for(let j = 0; j < talkes.length; j++) {
            if(talkes[i].sessionId != talkes[j].sessionId && (i != j)) {
                checkEqual = true;
            }
        }
        if(!checkEqual) {
            return false;
        }
        checkEqual = false;
    }
    //check if summary duration of each session is not bigger than max
    let durationSum = 0;
    for(let i=0; i < sessionsNum; i++) {
        talkes.forEach(talk => {
            if(talk.sessionId == i) {
                durationSum += talk.duration;
                if(!(i % 2)) {
                    if(durationSum > minSessionTime) {
                        return false;
                    }
                } 
                else {
                    if(durationSum > maxSessionTime) {
                        return false;
                    }
                }
            }
        });
        if(!(i % 2)) {
            if(durationSum != minSessionTime) {
                return false;
            }
        } 
        else {
            if(durationSum < minSessionTime || durationSum > maxSessionTime) {
                return false;
            }
        }
        durationSum = 0;
    }

    return true;
}

