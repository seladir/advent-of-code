import { readFileSync } from 'fs';

const field = readFileSync('full.txt', 'utf8').split('\n')
    .map(row => row.split(''));
let result = 0;

function iteration(): void {
    for (let x = 0; x < field[0].length; x += 1) {
        let bestPosition = 0;
        for (let y = 0; y < field.length; y += 1) {
            if (field[y][x] === '#') {
                bestPosition = y + 1;
            } else if (field[y][x] === 'O') {
                field[y][x] = '.';
                field[bestPosition][x] = 'O';
                bestPosition += 1;
            }
        }
    }
    for (let y = 0; y < field.length; y += 1) {
        let bestPosition = 0;
        for (let x = 0; x < field[0].length; x += 1) {
            if (field[y][x] === '#') {
                bestPosition = x + 1;
            } else if (field[y][x] === 'O') {
                field[y][x] = '.';
                field[y][bestPosition] = 'O';
                bestPosition += 1;
            }
        }
    }
    for (let x = 0; x < field[0].length; x += 1) {
        let bestPosition = field.length - 1;
        for (let y = field.length - 1; y >= 0; y -= 1) {
            if (field[y][x] === '#') {
                bestPosition = y - 1;
            } else if (field[y][x] === 'O') {
                field[y][x] = '.';
                field[bestPosition][x] = 'O';
                bestPosition -= 1;
            }
        }
    }
    for (let y = 0; y < field.length; y += 1) {
        let bestPosition = field[0].length - 1;
        for (let x = field[0].length - 1; x >= 0; x -= 1) {
            if (field[y][x] === '#') {
                bestPosition = x - 1;
            } else if (field[y][x] === 'O') {
                field[y][x] = '.';
                field[y][bestPosition] = 'O';
                bestPosition -= 1;
            }
        }
    }
}

function calculate(): number {
    let sum = 0;
    for (let x = 0; x < field[0].length; x += 1) {
        for (let y = 0; y < field.length; y += 1) {
            if (field[y][x] === 'O') {
                sum += field.length - y;
            }
        }
    }
    return sum;
}

let i: number;
for (i = 1; i <= 300; i += 1) {
    iteration();
    result = calculate();
    console.log(result);
}

// after that I found a cycle in results and did needed math manually
// 1000000000 - (274 + 26 * 38461527)
// 24 member of the cycle
// 90928
