import { readFileSync } from 'fs';

type PartNumber = {
    digits: string;
    hasAdjacentSymbol: boolean;
}

const file = readFileSync('full.txt', 'utf8');
const eng = file.split('\n');
const w = eng[0].length;
const h = eng.length;

function isSymbol(x: number, y: number): boolean {
    if (!eng[y] || !eng[y][x] || eng[y][x] === '.') {
        return false;
    }
    return Number.isNaN(parseInt(eng[y][x], 10));
}

function isNumber(x: number, y: number): boolean {
    return !Number.isNaN(parseInt(eng[y][x], 10));
}

function hasAdjacentSymbol(x: number, y: number): boolean {
    return isSymbol(x - 1, y - 1) || isSymbol(x, y - 1) || isSymbol(x + 1, y - 1)
        || isSymbol(x - 1, y) || isSymbol(x + 1, y)
        || isSymbol(x - 1, y + 1) || isSymbol(x, y + 1) || isSymbol(x + 1, y + 1);
}

let sum = 0;
let inNumber = false;
let curPartNum: PartNumber = { digits: '', hasAdjacentSymbol: false };
for (let y = 0; y < h; y += 1) {
    for (let x = 0; x <= w; x += 1) {
        if (isNumber(x, y)) {
            if (!inNumber) {
                inNumber = true;
                curPartNum = { digits: '', hasAdjacentSymbol: false };
            }

            curPartNum.digits += eng[y][x];
            curPartNum.hasAdjacentSymbol ||= hasAdjacentSymbol(x, y);
        } else {
            if (inNumber) {
                inNumber = false;
                if (curPartNum.hasAdjacentSymbol) {
                    sum += parseInt(curPartNum.digits, 10);
                }
            }
        }
    }
}

console.log(sum);
