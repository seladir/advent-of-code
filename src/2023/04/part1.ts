import { readFileSync } from 'fs';

type Card = {
    winNumbers: number[];
    myNumbers: number[];
}

function parseRow(row: string): Card {
    const numbersRaw = row.split(':')[1];
    const [winNumbersRaw, myNumbersRaw] = numbersRaw.split('|');
    return { winNumbers: parseNumbers(winNumbersRaw), myNumbers: parseNumbers(myNumbersRaw) };
}

function parseNumbers(numString: string): number[] {
    return numString.split(' ').filter(n => n).map(n => Number(n));
}

const file = readFileSync('full.txt', 'utf8');
const rows = file.split('\n');
let sum = 0;
rows.forEach((row) => {
   const card = parseRow(row);
   const myWinNumbersCount = card.winNumbers.filter(winNum => card.myNumbers.includes(winNum)).length;
   if (myWinNumbersCount) {
       sum += 2 ** (myWinNumbersCount - 1);
   }
});
console.log(sum);
