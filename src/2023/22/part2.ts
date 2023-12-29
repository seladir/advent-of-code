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

function fall(mapCopy: boolean[][][], bricksCopy: number[][][]): number[] {
    const fallenBricks: number[] = [];
    for (let b = 0; b < bricksCopy.length; b += 1) {
        const hasBrickDropped = dropBrick(mapCopy, bricksCopy[b]);
        if (hasBrickDropped) {
            fallenBricks.push(b);
        }
    }

    return fallenBricks;
}

function dropBrick( mapCopy: boolean[][][], brick: number[][]): boolean {
    const belowBrick = brick[0][2] - 1;
    if (belowBrick === 0) {
        return false;
    }
    const topOfBrick = brick[1][2];
    for (let x = brick[0][0]; x <= brick[1][0]; x += 1) {
        for (let y = brick[0][1]; y <= brick[1][1]; y += 1) {
            if (mapCopy[x][y][belowBrick]) {
                return false;
            }
        }
    }

    brick[0][2] -= 1;
    brick[1][2] -= 1;

    for (let x = brick[0][0]; x <= brick[1][0]; x += 1) {
        for (let y = brick[0][1]; y <= brick[1][1]; y += 1) {
            mapCopy[x][y][belowBrick] = true;
            mapCopy[x][y][topOfBrick] = false;
        }
    }

    return true;
}

let fallenBricks: number[] = [];
do {
    fallenBricks = fall(map, bricks);
} while (fallenBricks.length);

let counter = 0;
for (let b = 0; b < bricks.length; b += 1) {
    alterBrickState(bricks[b], false);

    const mapWarp: boolean[][][] = [];
    for (let x = 0; x <= maxX; x += 1) {
        mapWarp.push([]);
        for (let y = 0; y <= maxY; y += 1) {
            mapWarp[x].push([]);
            for (let z = 0; z <= maxZ; z += 1) {
                mapWarp[x][y].push(map[x][y][z]);
            }
        }
    }

    const bricksWarp: number[][][] = [];
    for (let bb = 0; bb < bricks.length; bb += 1) {
        if (bb === b) {
            continue;
        }
        bricksWarp.push([[...bricks[bb][0]], [...bricks[bb][1]]]);
    }

    let allFallenBricks: number[] = [];
    let fallenBricks: number[] = [];
    do {
        fallenBricks = fall(mapWarp, bricksWarp);
        allFallenBricks = allFallenBricks.concat(fallenBricks);
    } while (fallenBricks.length);

    alterBrickState(bricks[b], true);

    allFallenBricks = [...new Set(allFallenBricks)];
    counter += allFallenBricks.length;
}
console.log(counter);
//SHIIITTTYY CODE BUT I DONT WANT TO REFACTOR IT