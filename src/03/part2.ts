import { readFileSync } from 'fs';

type PartNumber = {
    digits: string;
    gears: number[];
}

const file = readFileSync('full.txt', 'utf8');
const eng = file.split('\n');
const l = eng[0].length;
const h = eng.length;

function isNumber(x: number, y: number): boolean {
    return !Number.isNaN(parseInt(eng[y][x], 10));
}

function getGear(x: number, y: number): number {
    if (!eng[y] || !eng[y][x] || eng[y][x] !== '*') {
        return NaN;
    }
    return (y - 1) * l + x;
}

function getAdjacentGears(x: number, y: number): number[] {
    return [getGear(x - 1, y - 1), getGear(x, y - 1), getGear(x + 1, y - 1), getGear(x - 1, y),
        getGear(x + 1, y), getGear(x - 1, y + 1), getGear(x, y + 1), getGear(x + 1, y + 1)]
        .filter((g) => !isNaN(g));
}

let inNumber = false;
let numbers: PartNumber[] = [];
let curNum: PartNumber = { digits: '', gears: [] };
for (let y = 0; y < h; y += 1) {
    for (let x = 0; x <= l; x += 1) {
        if (isNumber(x, y)) {
            if (!inNumber) {
                inNumber = true;
                curNum = { digits: '', gears: [] };
            }

            curNum.digits += eng[y][x];
            curNum.gears.push(...getAdjacentGears(x, y));
            curNum.gears = [...new Set(curNum.gears)];
        } else {
            if (inNumber) {
                inNumber = false;
                if (curNum.gears.length) {
                    numbers.push(curNum);
                }
            }
        }
    }
}

const gearCandidates = new Map<number, number[]>();
numbers.forEach((num) => {
    num.gears.forEach((gearAddress) => {
        const existingNums = gearCandidates.get(gearAddress);
        if (existingNums !== undefined) {
            gearCandidates.set(gearAddress, [...existingNums, Number(num.digits)]);
        } else {
            gearCandidates.set(gearAddress, [Number(num.digits)]);
        }
    });
});

let sum = 0;
gearCandidates.forEach((gearCandidate) => {
    if (gearCandidate.length === 2) {
        sum += gearCandidate[0] * gearCandidate[1];
    }
});

console.log(sum);
