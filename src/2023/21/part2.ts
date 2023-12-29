import { readFileSync } from 'fs';

type Tile = {
    isPlot: boolean;
    warps: {
        x: number;
        y: number;
        distance: number;
    }[];
}

type XY = {
    x: number;
    y: number;
}

type ToGo = {
    x: number;
    y: number;
}

const directions: XY[] = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
];

const limit = 50;

const rows = readFileSync('demo.txt', 'utf8').split('\n');
const width = rows[0].length;
const height = rows.length;
let startX = 0;
let startY = 0;

// let plots = 0;
// let stones = 0;
const garden: Tile[][] = [];
for (let y = 0; y < height; y += 1) {
    garden.push([]);
    for (let x = 0; x < width; x += 1) {
        // if (rows[y][x] === '#') {
        //     stones += 1;
        // } else {
        //     plots += 1;
        // }
        garden[y].push({
            isPlot: rows[y][x] !== '#',
            warps: [],
        });
        if (rows[y][x] === 'S') {
            startX = x;
            startY = y;
        }
    }
}

// console.log(plots, stones + plots);

function normalize(k: number): number {
    if (k < 0) {
        return ((k % width) + width) % width;
    }
    if (k >= width) {
        return k % width;
    }

    return k;
}

let plots = 0;
let stones = 0;

for (let y = -limit; y <= limit; y += 1) {
    const absY = Math.abs(y);
    for (let x = -(limit - absY); x <= limit - absY; x += 1) {
        if ((absY + Math.abs(x)) % 2 === 0) {
            if (rows[normalize(y + startY)][normalize(x + startX)] === '#') {
                stones += 1;
            } else {
                plots += 1;
            }
        }
    }
}
console.log(plots, stones);

// garden[startY][startX].warps.push({ x: startX, y: startY, distance: 0 });
// const tilesToGo: ToGo[] = [{ x: startX, y: startY }];
// let tile: ToGo | undefined;
// do {
//     tile = tilesToGo.shift();
//     if (tile !== undefined) {
//         for (const d of directions) {
//             const tx = tile.x;
//             const ty = tile.y;
//             const ax = tx + d.x;
//             const ay = ty + d.y;
//             const nx = normalize(ax);
//             const ny = normalize(ay);
//
//             if (garden[ny][nx] === undefined) {
//                 console.log(ax, ay, nx, ny);
//             }
//
//             if (!garden[ny][nx].isPlot || garden[ny][nx].warps.find(warp => warp.x === ax && warp.y === ay)) {
//                 continue;
//             }
//
//             const warp = garden[normalize(ty)][normalize(tx)].warps.find(warp => warp.x === tx && warp.y === ty);
//             if (warp === undefined) {
//                 throw new Error('hm');
//             }
//
//             garden[ny][nx].warps.push({
//                 x: ax,
//                 y: ay,
//                 distance: warp.distance + 1,
//             });
//
//             if (warp.distance + 1 !== limit) {
//                 tilesToGo.push({ x: ax, y: ay });
//             }
//         }
//     }
// } while (tile !== undefined);
//
// // console.log(garden[startY][startX - 2].warps.filter(warp => warp.distance % 2 === 0));
//
// let sum = 0;
// for (let y = 0; y < height; y += 1) {
//     for (let x = 0; x < width; x += 1) {
//         for (const warp of garden[y][x].warps) {
//             if (warp.distance <= limit && warp.distance % 2 === 0) {
//                 sum += 1;
//             }
//         }
//     }
// }
// console.log(limit, sum);