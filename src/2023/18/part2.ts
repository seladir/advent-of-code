import { readFileSync } from 'fs';

type XY = {
    x: number;
    y: number;
}

const directions: Record<string, XY> = {
    '2': { x: -1, y: 0 },
    '0': { x: 1, y: 0 },
    '3': { x: 0, y: -1 },
    '1': { x: 0, y: 1 },
}

let currentX = 0;
let currentY = 0;

const vertices: XY[] = [{ x: 0, y: 0 }];
const rows = readFileSync('full.txt', 'utf8').split('\n');

let perimeter = 0;
for (const row of rows) {
    const parts = row.split(' ');
    const hex = parts[2].replace(/\W/g, '');
    const distance = parseInt(hex.slice(0, 5), 16);
    perimeter += distance;
    const direction =  directions[hex[5]];

    currentX += direction.x * distance;
    currentY += direction.y * distance;
    vertices.push({ x: currentX, y: currentY });
}
perimeter = perimeter / 2 + 1;

let sum = 0;
for (let i = 0; i < vertices.length - 1; i += 1) {
    sum += (vertices[i].x * vertices[i + 1].y - vertices[i + 1].x * vertices[i].y);
}
sum = Math.abs(sum) / 2;
console.log(sum + perimeter);