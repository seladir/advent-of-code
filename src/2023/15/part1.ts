import { readFileSync } from 'fs';

const steps = readFileSync('full.txt', 'utf8').split(',');
let sum = 0;

for (const step of steps) {
    let hash = 0;
    for (let i = 0; i < step.length; i += 1) {
        hash += step.charCodeAt(i);
        hash *= 17;
        hash %= 256;
    }
    sum += hash;
}

console.log(sum);