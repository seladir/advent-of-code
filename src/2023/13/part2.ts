import { readFileSync } from 'fs';

type Result = {
    count: number;
    position: string;
}

const input = readFileSync('full.txt', 'utf8')
    .replace(/\./g, '0')
    .replace(/#/g, '1');

const blocks = input.split('\n\n').map(block => block.split('\n'));
let i = 0;
function checkBlock(block: string[]) {
    const referenceResult = checkBlockVariant(block, { count: 0, position: 'blah' }) as Result;

    for (let y = 0; y < block.length; y += 1) {
        for (let x = 0; x < block[0].length; x += 1) {
            const replacement = block[y][x] == '0' ? '1' : '0';
            block[y] = block[y].slice(0, x) + replacement + block[y].slice(x + 1);

            const result = checkBlockVariant(block, referenceResult);
            if (result !== null) {
                if (result.position === 'rows') {
                    return result.count * 100;
                }

                return result.count;
            }

            const reverseReplacement = block[y][x] == '0' ? '1' : '0';
            block[y] = block[y].slice(0, x) + reverseReplacement + block[y].slice(x + 1);
        }
    }

    console.warn('hmm', block, i, referenceResult);
    return 0;
}

function checkBlockVariant(block: string[], resultToIgnore: Result): Result | null {
    const rows: number[] = [];
    for (let i = 0; i < block.length; i += 1) {
        rows.push(Number(`0b${block[i]}`));
    }

    let count = checkLine(rows, resultToIgnore.position === 'rows' ? resultToIgnore.count : 0);
    if (count) {
        return { count, position: 'rows'};
    }

    const columns: number[] = [];
    for (let j = 0; j < block[0].length; j += 1) {
        let column = '0b';
        for (let i = 0; i < block.length; i += 1) {
            column += block[i][j];
        }
        columns.push(Number(column));
    }

    count = checkLine(columns, resultToIgnore.position === 'columns' ? resultToIgnore.count : 0);
    if (count) {
        return { count, position: 'columns'};
    }

    return null;
}

function checkLine(line: number[], countToIgnore: number): number {
    for (let i = 0; i < line.length - 1; i += 1) {
        if (line[i] === line[i + 1] && countToIgnore !== i + 1) {
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
    i++;
    const result =  checkBlock(block);
    sum += result;
}

console.log(sum);