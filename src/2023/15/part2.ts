import { readFileSync } from 'fs';

type Lens = {
    label: string;
    focalLength: number;
}

const steps = readFileSync('full.txt', 'utf8').split(',');
const boxes: Lens[][] = new Array(256);
for (let i = 0; i < 256; i += 1) {
    boxes[i] = [];
}

for (const step of steps) {
    let label: string;
    let focalLength: number = 0;
    let delimiterIndex = step.indexOf('-');
    if (delimiterIndex === - 1) {
        const parts = step.split('=');
        label = parts[0];
        focalLength = Number(parts[1]);
    } else {
        label = step.slice(0, delimiterIndex);
    }

    let hash = 0;
    for (let i = 0; i < label.length; i += 1) {
        hash += label.charCodeAt(i);
        hash *= 17;
        hash %= 256;
    }

    const lensIndex = boxes[hash].findIndex(lens => lens.label === label);
    if (focalLength) {
        if (lensIndex === - 1) {
            boxes[hash].push({ label, focalLength });
        } else {
            boxes[hash][lensIndex].focalLength = focalLength;
        }
    } else {
        if (lensIndex !== - 1) {
            boxes[hash] = [...boxes[hash].slice(0, lensIndex), ...boxes[hash].slice(lensIndex + 1)];
        }
    }
}

let sum = 0;
for (let i = 0; i < 256; i += 1) {
    for (let j = 0; j < boxes[i].length; j += 1) {
        sum += (i + 1) * (j + 1) * boxes[i][j].focalLength;
    }
}

console.log(sum);