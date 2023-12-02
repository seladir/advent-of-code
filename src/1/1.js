import { readFileSync } from 'fs';

const file = readFileSync('1.txt', 'utf8');
const rows = file.split('\n');

const words = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9};
const rxBase = 'one|two|three|four|five|six|seven|eight|nine';

let sum = 0;
rows.forEach((row) => {
    const number = findFirstNumber(row, false) + findFirstNumber(row, true);
    sum += parseInt(number, 10);
});

console.log(sum);

function findFirstNumber(row, isReversed) {
    const rx = isReversed ? new RegExp(reverse(rxBase)) : new RegExp(rxBase);
    let digitalized = isReversed ? reverse(row) : row;
    let searchResult = null;
    do {
        searchResult = digitalized.match(rx);
        if (searchResult !== null) {
            digitalized = digitalized.substring(0, searchResult.index)
                + getDigit(searchResult[0], isReversed).toString()
                + digitalized.substring(searchResult.index + searchResult[0].length);
        }
    } while (searchResult !== null);

    let digits = digitalized.replace(/[a-z]/g, '');
    return digits[0];
}

function getDigit(word, isReversed) {
    return isReversed ? words[reverse(word)] : words[word];
}

function reverse(s) {
    return s.split('').reverse().join('');
}

