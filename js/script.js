'use strict';

const dataElem = document.querySelector('#data');
const enterBtn = document.querySelector('#btn');

enterBtn.addEventListener('click', (e) => {
    e.stopPropagation;
    const userData = dataElem.value;
    const parsedData = parseToObj(userData);
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

    return result;
}
