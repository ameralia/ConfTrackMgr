'use strict';

const dataElem = document.querySelector('#data');
const enterBtn = document.querySelector('#btn');
let parsedData,
    summaryTime = 0;

enterBtn.addEventListener('click', (e) => {
    e.stopPropagation;
    const userData = dataElem.value;
    parsedData = parseToObj(userData);
    console.log(parsedData);
});

function parseToObj(data) {
    const replaceFrom = 'lightning';
    const replaceTo = '5min';
    const regex = /\d+/g;
    let result = [];

    data = data.replace(replaceFrom, replaceTo);
    let lines = data.split('\n');
    lines = lines.filter(line => line != '');

    lines.forEach((line, i) => {
        result.push({
            id: i,
            title: line.slice(0, line.search(regex)),
            duration: parseInt(line.match(regex))
        });
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
