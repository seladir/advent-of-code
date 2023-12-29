import { readFileSync } from 'fs';

type Tile = {
    isPlot: boolean;
    distance: number;
    isVisited: boolean;
}

type XY = {
    x: number;
    y: number;
}

const directions: XY[] = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
];

const limit = 64;

const rows = readFileSync('full.txt', 'utf8').split('\n');
const width = rows[0].length;
const height = rows.length;
let startX = 0;
let startY = 0;

const garden: Tile[][] = [];
for (let y = 0; y < height; y += 1) {
    garden.push([]);
    for (let x = 0; x < width; x += 1) {
        garden[y].push({
            isPlot: rows[y][x] !== '#',
            distance: Infinity,
            isVisited: false,
        });
        if (rows[y][x] === 'S') {
            startX = x;
            startY = y;
        }
    }
}

garden[startY][startX].isVisited = true;
garden[startY][startX].distance = 0;
const tilesToGo: XY[] = [{ x: startX, y: startY}];
let tile: XY | undefined;
do {
    tile = tilesToGo.shift();
    if (tile !== undefined) {
        for (const d of directions) {
            const dx = tile.x + d.x;
            const dy = tile.y + d.y;
            if (dx < 0 || dy < 0 || dx >= width || dy >= height) {
                continue;
            }
            if (!garden[dy][dx].isPlot || garden[dy][dx].isVisited) {
                continue;
            }

            garden[dy][dx].isVisited = true;
            garden[dy][dx].distance = garden[tile.y][tile.x].distance + 1;

            if (garden[dy][dx].distance !== limit) {
                tilesToGo.push({x: dx, y: dy});
            }
        }
    }
} while (tile !== undefined);

let sum = 0;
for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
        if (garden[y][x].distance <= limit && garden[y][x].distance % 2 === 0) {
            sum += 1;
        }
    }
}

console.log(sum);