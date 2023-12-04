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
            cubeSet[color] = parseInt(cubeRaw.replace(/\[a-z]/g, ''), 10);
        });

        return cubeSet;
    });
});


let sum = 0;
games.forEach((game) => {
    const goal: CubeSet = {
        blue: 0,
        green: 0,
        red: 0,
    }
    game.forEach((set) => {
        if (set.blue > goal.blue) {
            goal.blue = set.blue;
        }
        if (set.green > goal.green) {
            goal.green = set.green;
        }
        if (set.red > goal.red) {
            goal.red = set.red;
        }
    });

    sum += goal.blue * goal.green * goal.red;
});

console.log(sum);
