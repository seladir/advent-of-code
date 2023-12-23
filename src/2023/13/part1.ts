import { readFileSync } from 'fs';

const input = readFileSync('full.txt', 'utf8')
    .replace(/\./g, '0')
    .replace(/#/g, '1');

const blocks = input.split('\n\n').map(block => block.split('\n'));

function checkLine(line: number[]): number {
    for (let i = 0; i < line.length - 1; i += 1) {
        if (line[i] === line[i + 1]) {
            const reflectionCount = Math.min(i, line.length - i - 2);
            let isMirror = true;
            for (let j = 1; j <= reflectionCount; j += 1) {
                if (line[i - j] !== line[i + 1 + j]) {
                    isMirror = false;
                    break;
                }
            }
            if (isMirror) {
                return i + 1;
            }
        }
    }

    return 0;
}

let sum = 0;
for (const block of blocks) {
    const rows: number[] = [];
    for (let i = 0; i < block.length; i += 1) {
        rows.push(Number(`0b${block[i]}`));
    }

    sum += 100 * checkLine(rows);

    const columns: number[] = [];
    for (let j = 0; j < block[0].length; j += 1) {
        let column = '0b';
        for (let i = 0; i < block.length; i += 1) {
            column += block[i][j];
        }
        columns.push(Number(column));
    }

    sum += checkLine(columns);
}

console.log(sum);