import { readFileSync } from 'fs';

function parseRow(row: string): number[] {
    return row.substring(11).split(' ').filter(n => n).map(n => Number(n));
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const times = parseRow(rows[0]);
const distances = parseRow(rows[1]);

function solve(a: number, b: number, c: number): number[] {
    const disc = b * b - 4 * a * c;
    const root1 = (-b + Math.sqrt(disc)) / (2 * a);
    const root2 = (-b - Math.sqrt(disc)) / (2 * a);
    return [root1, root2];
}

let result = 1;
for (let i = 0; i < times.length; i += 1) {
    const roots = solve(-1, times[i], -(distances[i] + 1));
    const min = Math.ceil(roots[0]);
    const max = Math.floor(roots[1]);
    const waysCount = max - min + 1;
    result *= waysCount;
}
console.log(result);