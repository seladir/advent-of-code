import { readFileSync } from 'fs';

type Direction = {
    x: number;
    y: number;
}

type Tile = {
    ends: Direction[];
}

const rows = readFileSync('full.txt', 'utf8').split('\n');

let sx = 0;
let sy = 0;
const w = rows[0].length - 1;
const h = rows.length - 1;

const map: Tile[][] = rows.map((row, y) => {
    const parsed: Tile[] = [];
    for (let x = 0; x < row.length; x += 1) {
        const tile: Tile = {
            ends: [],
        }
        switch (row[x]) {
            case 'S':
                sx = x;
                sy = y;
                break;
            case '|':
                tile.ends.push({x: 0, y: -1}, {x: 0, y: 1});
                break;
            case '-':
                tile.ends.push({x: -1, y: 0}, {x: 1, y: 0});
                break;
            case 'L':
                tile.ends.push({x: 0, y: -1}, {x: 1, y: 0});
                break;
            case 'J':
                tile.ends.push({x: -1, y: 0}, {x: 0, y: -1});
                break;
            case '7':
                tile.ends.push({x: -1, y: 0}, {x: 0, y: 1});
                break;
            case 'F':
                tile.ends.push({x: 1, y: 0}, {x: 0, y: 1});
                break;
        }
        parsed.push(tile);
    }
    return parsed;
});

const directions = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];

function go(): number {
    for (const startingDirection of directions) {
        let x = sx;
        let y = sy;
        let d: Direction | null = startingDirection;
        let steps = 0;

        do {
            steps += 1;
            x += d.x;
            y += d.y;
            if (x === sx && y === sy) {
                return steps / 2;
            }
            d = findNextDirection(x, y, d);
        } while (d !== null);
    }

    return 0;
}

function findNextDirection(x: number, y: number, d: Direction): Direction | null {
    if (x < 0 || y < 0 || x > w || y > h) {
        return null;
    }
    if (!map[y][x].ends.length) {
        return null;
    }
    const inIndex = map[y][x].ends.findIndex(end => end.x + d.x === 0 && end.y + d.y === 0);
    if (inIndex === -1) {
        return null;
    }
    const outIndex = inIndex === 0 ? 1 : 0;
    return map[y][x].ends[outIndex];
}

console.log(go());