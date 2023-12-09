import { readFileSync } from 'fs';

type Node = {
    L: string;
    R: string;
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const instructions = rows[0];

const map: Record<string, Node> = {};
for (let i = 2; i < rows.length; i += 1) {
    const letters = rows[i].replace(/\W/g, '');
    const node = letters.substring(0, 3);
    const left = letters.substring(3, 6);
    const right = letters.substring(6);
    map[node] = {
        L: left,
        R: right,
    };
}

let stepsCount = 0;
let instructionIndex = 0;
let currentNode = 'AAA';
do {
    if (instructionIndex === instructions.length) {
        instructionIndex = 0;
    }
    const instruction = instructions[instructionIndex] as 'L' | 'R';

    currentNode = map[currentNode][instruction];
    stepsCount += 1;
    instructionIndex += 1;
} while (currentNode !== 'ZZZ');
console.log(stepsCount);