import { readFileSync } from 'fs';

type Seed = {
    start: number;
    end: number;
}

type Step = {
    destStart: number;
    sourceStart: number;
    sourceEnd: number;
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const seedsRaw = rows[0].substring(7).split(' ').map(n => Number(n));
const pipeline: Step[][] = [];
let stepRaw: number[] = [];
for (let i = 2; i < rows.length; i += 1 ) {
    if (rows[i].at(-1) === ':') {
        pipeline.push([]);
    } else if (rows[i]) {
        stepRaw = rows[i].split(' ').map(n => Number(n));
        pipeline[pipeline.length - 1].push({
            destStart: stepRaw[0],
            sourceStart: stepRaw[1],
            sourceEnd: stepRaw[1] + stepRaw[2] - 1,
        });
    }
}

let seeds: Seed[] = [];
for (let i = 0; i < seedsRaw.length - 1; i += 2) {
    seeds.push({
        start: seedsRaw[i],
        end: seedsRaw[i] + seedsRaw[i + 1] - 1,
    });
}

let convertedSeeds: Seed[] = [];
let unresolvedSeeds: Seed[] = [];
pipeline.forEach((step) => {
    convertedSeeds = [];
    step.forEach((rule) => {
        unresolvedSeeds = [];
        seeds.forEach((seed) => {
            const interStart = seed.start < rule.sourceStart ? rule.sourceStart : seed.start;
            const interEnd = seed.end > rule.sourceEnd ? rule.sourceEnd : seed.end;
            if (interStart > interEnd) {
                unresolvedSeeds.push(seed);
                return;
            }
            if (interStart > seed.start) {
                unresolvedSeeds.push({
                    start: seed.start,
                    end: interStart - 1,
                });
            }
            if (interEnd < seed.end) {
                unresolvedSeeds.push({
                    start: interEnd + 1,
                    end: seed.end,
                });
            }
            convertedSeeds.push({
                start: interStart - rule.sourceStart + rule.destStart,
                end: interEnd - rule.sourceStart + rule.destStart,
            });
        });
        seeds = [...unresolvedSeeds];
    });
    seeds = [...convertedSeeds, ...unresolvedSeeds];
});

let minLocation = Infinity;
seeds.forEach((seed) => {
    if (seed.start < minLocation) {
        minLocation = seed.start;
    }
});

console.log(minLocation);