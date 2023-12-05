import { readFileSync } from 'fs';

const rows = readFileSync('full.txt', 'utf8').split('\n');
const seeds = rows[0].substring(7).split(' ').map(n => Number(n));
const pipeline: number[][][] = [];
for (let i = 2; i < rows.length; i += 1 ) {
    if (rows[i].at(-1) === ':') {
        pipeline.push([]);
    } else if (rows[i]) {
        pipeline[pipeline.length - 1].push(rows[i].split(' ').map(n => Number(n)));
    }
}

let minLocation = Infinity;
const locations = seeds.map((seed) => {
    let converted = seed;
    pipeline.forEach((step) => {
        step.every((rule) => {
            if (converted >= rule[1] && converted < rule[1] + rule[2]) {
                converted += rule[0] - rule[1];
                return false;
            }
            return true;
        });
    });
    if (converted < minLocation) {
        minLocation = converted;
    }
});
console.log(minLocation);