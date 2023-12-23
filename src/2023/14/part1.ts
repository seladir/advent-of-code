import { readFileSync } from 'fs';

const field = readFileSync('full.txt', 'utf8').split('\n');

let sum = 0;
for (let x = 0; x < field[0].length; x += 1) {
    let bestPosition = 0;
    for (let y = 0; y < field.length; y += 1) {
        if (field[y][x] === '#') {
            bestPosition = y + 1;
        } else if (field[y][x] === 'O') {
            sum += field.length - bestPosition;
            bestPosition += 1;
        }
    }
}
console.log(sum);