import { readFileSync } from 'fs';

type Node = {
    L: number;
    R: number;
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const instructions = rows[0];
const nodesDict: Record<string, number> = {};
for (let i = 2; i < rows.length; i += 1) {
    const node = rows[i].substring(0, 3);
    nodesDict[node] = i - 2;
}

const map: Node[] = [];
for (let i = 2; i < rows.length; i += 1) {
    const letters = rows[i].replace(/\W/g, '');
    const left = letters.substring(3, 6);
    const right = letters.substring(6);
    map.push({
        L: nodesDict[left],
        R: nodesDict[right],
    });
}

let stepsCount = 0;
let instructionIndex = 0;
let nodeIndex = nodesDict['AAA'];
do {
    if (instructionIndex === instructions.length) {
        instructionIndex = 0;
    }
    const instruction = instructions[instructionIndex] as 'L' | 'R';
    nodeIndex = map[nodeIndex][instruction];
    stepsCount += 1;
    instructionIndex += 1;
} while (nodeIndex !== nodesDict['ZZZ']);
console.log(stepsCount);

