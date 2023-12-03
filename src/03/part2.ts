import { readFileSync } from 'fs';

type PartNumber = {
    digits: string;
    gearAddresses: number[];
}

const file = readFileSync('full.txt', 'utf8');
const eng = file.split('\n');
const l = eng[0].length;
const h = eng.length;

function isNumber(x: number, y: number): boolean {
    return !Number.isNaN(parseInt(eng[y][x], 10));
}

function getGearAddress(x: number, y: number): number {
    if (!eng[y] || !eng[y][x] || eng[y][x] !== '*') {
        return NaN;
    }
    return (y - 1) * l + x;
}

function getAdjacentGearAddresses(x: number, y: number): number[] {
    return [getGearAddress(x - 1, y - 1), getGearAddress(x, y - 1), getGearAddress(x + 1, y - 1), getGearAddress(x - 1, y),
        getGearAddress(x + 1, y), getGearAddress(x - 1, y + 1), getGearAddress(x, y + 1), getGearAddress(x + 1, y + 1)]
        .filter((g) => !isNaN(g));
}

let inPartNum = false;
let partNums: PartNumber[] = [];
let curPartNum: PartNumber = { digits: '', gearAddresses: [] };
for (let y = 0; y < h; y += 1) {
    for (let x = 0; x <= l; x += 1) {
        if (isNumber(x, y)) {
            if (!inPartNum) {
                inPartNum = true;
                curPartNum = { digits: '', gearAddresses: [] };
            }

            curPartNum.digits += eng[y][x];
            curPartNum.gearAddresses.push(...getAdjacentGearAddresses(x, y));
            curPartNum.gearAddresses = [...new Set(curPartNum.gearAddresses)];
        } else {
            if (inPartNum) {
                inPartNum = false;
                if (curPartNum.gearAddresses.length) {
                    partNums.push(curPartNum);
                }
            }
        }
    }
}

const gearCandidates = new Map<number, number[]>();
partNums.forEach((num) => {
    num.gearAddresses.forEach((gearAddress) => {
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
