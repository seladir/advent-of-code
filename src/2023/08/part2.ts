import { readFileSync } from 'fs';

type Node = {
    L: string;
    R: string;
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const instructions = rows[0];

const currentNodes: string[] = [];
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

    if (node[2] === 'A') {
        currentNodes.push(node);
    }
}

const distances: number[] = [];
let stepsCount = 0;
let instructionIndex = 0;
for (const node of currentNodes) {
    let currentNode = node;
    stepsCount = 0;
    instructionIndex = 0;
    do {
        if (instructionIndex === instructions.length) {
            instructionIndex = 0;
        }
        const instruction = instructions[instructionIndex] as 'L' | 'R';

        currentNode = map[currentNode][instruction];
        stepsCount += 1;
        instructionIndex += 1;
    } while (currentNode[2] !== 'Z');
    distances.push(stepsCount);
}

// dumb algorithm chosen but whatever
function findLCM(a: number, b: number): number {
    let large = Math.max(a, b);
    let small = Math.min(a, b);
    for (let i = large; ; i += large) {
        if (i % small == 0)
            return i;
    }
}

let LCM = distances[0];
for (const distance of distances.slice(1)) {
    LCM = findLCM(LCM, distance);
}

console.log(LCM);

