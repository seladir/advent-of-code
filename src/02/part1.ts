import { readFileSync } from 'fs';

type Color = 'blue' | 'green' | 'red';

type CubeSet = {
    blue: number;
    green: number;
    red: number;
}

type Game = CubeSet[];

const file = readFileSync('full.txt', 'utf8');
const rows = file.split('\n');

const games: Game[] = rows.map((row) => {
    const rowParts = row.split(':');
    const gameRaw = (rowParts[1] ?? '').replace(/\s/g, '');
    const setsRaw = gameRaw.split(';');

    return setsRaw.map((setRaw) => {
        const cubeSet: CubeSet = {
            blue: 0,
            green: 0,
            red: 0,
        }

        const cubesRaw = setRaw.split(',');
        cubesRaw.forEach((cubeRaw) => {
            const color = cubeRaw.replace(/\d/g, '') as Color;
            cubeSet[color]  = parseInt(cubeRaw.replace(/\[a-z]/g, ''), 10);
        });

        return cubeSet;
    });
});

const goal: CubeSet = {
    blue: 14,
    green: 13,
    red: 12,
}
let sum = 0;
games.forEach((game, id) => {
    if (isPossibleGame(game)) {
        sum += id + 1;
    }
});

function isPossibleGame(game: Game): boolean {
    return game.every(isPossibleSet);
}

function isPossibleSet(set: CubeSet): boolean {
    return set.blue <= goal.blue && set.green <= goal.green && set.red <= goal.red;
}

console.log(sum);

