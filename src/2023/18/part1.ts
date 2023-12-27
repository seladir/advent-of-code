import { readFileSync } from 'fs';

type Tile = {
    dug: boolean;
    outer: boolean;
}

type XY = {
    x: number;
    y: number;
}

const directions: Record<string, XY> = {
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
    U: { x: 0, y: -1 },
    D: { x: 0, y: 1 },
}

let lagoon: Tile[][] = [[{ dug: true, outer: false }]];
let width = 1;
let height = 1;
let currentX = 0;
let currentY = 0;

function expand(expandX: number, expandY: number) {
    const newWidth = width + Math.abs(expandX);
    const newHeight = height + Math.abs(expandY);
    const newLagoon: Tile[][] = [];
    for (let iy = 0; iy < newHeight; iy += 1) {
        newLagoon.push([]);
        for (let ix = 0; ix < newWidth; ix += 1) {
            const oldIx = expandX < 0 ? ix + expandX : ix;
            const oldIy = expandY < 0 ? iy + expandY : iy;
            if (oldIx < 0 || oldIy < 0 || oldIx >= width || oldIy >= height) {
                newLagoon[newLagoon.length - 1].push({ dug: false, outer: false });
            } else {
                newLagoon[newLagoon.length - 1].push(lagoon[oldIy][oldIx]);
            }
        }
    }
    lagoon = newLagoon;
    width = newWidth;
    height = newHeight;
    if (expandX < 0) {
        currentX -= expandX;
    }
    if (expandY < 0) {
        currentY -= expandY;
    }
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
for (const row of rows) {
    const parts = row.split(' ');
    const direction = directions[parts[0]];
    const distance = Number(parts[1]);

    const endX = currentX + direction.x * distance;
    const endY = currentY + direction.y * distance;
    if (endX < 0 || endY < 0 || endX >= width || endY >= height) {
        let expandX = 0;
        let expandY = 0;
        if (endX < 0) {
            expandX = endX;
        }
        if (endY < 0) {
            expandY = endY;
        }
        if (endX >= width) {
            expandX = endX - width + 1;
        }
        if (endY >= height) {
            expandY = endY - height + 1;
        }
        expand(expandX, expandY);
    }

    for (let i = 0; i < distance; i += 1) {
        currentX += direction.x;
        currentY += direction.y;
        lagoon[currentY][currentX] = { dug: true, outer: false };
    }
}

expand(-1, -1);
expand(1, 1);

const knownTiles: number[] = [0];
const tilesToExplore: XY[] = [{ x: 0, y: 0}];
let tile: XY | undefined;
do {
    tile = tilesToExplore.pop();
    if (tile !== undefined) {
        lagoon[tile.y][tile.x].outer = true;
        for (const d of Object.values(directions)) {
            const dx = tile.x + d.x;
            const dy = tile.y + d.y;
            if (dx < 0 || dy < 0 || dx >= width || dy >= height) {
                continue;
            }
            if (lagoon[dy][dx].dug) {
                continue;
            }
            const tileIndex = dx + dy * width;
            if (knownTiles.includes(tileIndex)) {
                continue;
            }
            knownTiles.push(tileIndex);
            tilesToExplore.push({ x: dx, y: dy});
        }
    }
} while (tile !== undefined);

let sum = 0;
for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
        if (!lagoon[y][x].outer) {
            lagoon[y][x].dug = true;
        }
        if (lagoon[y][x].dug) {
            sum += 1;
        }
    }
}
console.log(sum);