import { readFileSync } from 'fs';

const rows = readFileSync('full.txt', 'utf8').split('\n');

const bricks: number[][][] = [];
let maxX = 0;
let maxY = 0;
let maxZ = 0;
for (const row of rows) {
    const brick = row.split('~').map(part => part.split(',').map(coor => Number(coor)));
    maxX = Math.max(maxX, brick[0][0], brick[1][0]);
    maxY = Math.max(maxY, brick[0][1], brick[1][1]);
    maxZ = Math.max(maxZ, brick[0][2], brick[1][2]);
    bricks.push(brick);
}

bricks.sort((brickA: number[][], brickB: number[][]) => {
    return brickA[0][2] - brickB[0][2];
});

const map: boolean[][][] = [];
for (let x = 0; x <= maxX; x += 1) {
    map.push([]);
    for (let y = 0; y <= maxY; y += 1) {
        map[x].push([]);
        for (let z = 0; z <= maxZ; z += 1) {
            map[x][y].push(false);
        }
    }
}

function alterBrickState(brick: number[][], action: boolean): void {
    for (let x = brick[0][0]; x <= brick[1][0]; x += 1) {
        for (let y = brick[0][1]; y <= brick[1][1]; y += 1) {
            for (let z = brick[0][2]; z <= brick[1][2]; z += 1) {
                map[x][y][z] = action;
            }
        }
    }
}

for (const brick of bricks) {
    alterBrickState(brick, true);
}

function fall(really: boolean): boolean {
    let hasBrickDropped = false;
    for (const brick of bricks) {
        hasBrickDropped = hasBrickDropped || dropBrick(brick, really);
    }

    return hasBrickDropped;
}

function dropBrick(brick: number[][], really: boolean): boolean {
    const belowBrick = brick[0][2] - 1;
    if (belowBrick === 0) {
        return false;
    }
    const topOfBrick = brick[1][2];
    for (let x = brick[0][0]; x <= brick[1][0]; x += 1) {
        for (let y = brick[0][1]; y <= brick[1][1]; y += 1) {
            if (map[x][y][belowBrick]) {
                return false;
            }
        }
    }

    if (!really) {
        return true;
    }

    brick[0][2] -= 1;
    brick[1][2] -= 1;

    for (let x = brick[0][0]; x <= brick[1][0]; x += 1) {
        for (let y = brick[0][1]; y <= brick[1][1]; y += 1) {
            map[x][y][belowBrick] = true;
            map[x][y][topOfBrick] = false;
        }
    }

    return true;
}

let hasFallen = false;
do {
    hasFallen = fall(true);
} while (hasFallen);

let counter = 0;
for (const brick of bricks) {
    alterBrickState(brick, false);
    hasFallen = fall(false);
    if (!hasFallen) {
        counter += 1;
    }
    alterBrickState(brick, true);
}
console.log(counter);