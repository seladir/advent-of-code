import { readFileSync } from 'fs';

const rows = readFileSync('full.txt', 'utf8').split('\n');
const time = Number(rows[0].replace(/\D/g, ''));
const distance = Number(rows[1].replace(/\D/g, ''));

function solve(a: number, b: number, c: number): number[] {
    const disc = b * b - 4 * a * c;
    const root1 = (-b + Math.sqrt(disc)) / (2 * a);
    const root2 = (-b - Math.sqrt(disc)) / (2 * a);
    return [root1, root2];
}

const roots = solve(-1, time, -(distance + 1));
const min = Math.ceil(roots[0]);
const max = Math.floor(roots[1]);
const waysCount = max - min + 1;
console.log(waysCount);