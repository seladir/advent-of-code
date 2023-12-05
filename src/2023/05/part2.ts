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
for (let i = 0; i < seeds.length - 1; i += 2) {
    for (let j = 0; j < seeds[i + 1]; j += 1) {
        let converted = seeds[i] + j;
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
    }
}
console.log(minLocation);