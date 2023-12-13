import { readFileSync } from 'fs';

type XY = {
    x: number;
    y: number;
}

type Pipe = {
    ends: XY[];
}

const rows = readFileSync('full.txt', 'utf8').split('\n');

let sx = 0;
let sy = 0;
const mapW = rows[0].length - 1;
const mapH = rows.length - 1;

const directions = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];

const emptySchemeRow: (Pipe | null)[]  = new Array(rows[0].length).fill(null);

const map: Pipe[][] = rows.map((row, y) => {
    const parsed: Pipe[] = [];
    for (let x = 0; x < row.length; x += 1) {
        const pipe: Pipe = {
            ends: [],
        }
        switch (row[x]) {
            case 'S':
                sx = x;
                sy = y;
                break;
            case '|':
                pipe.ends.push({x: 0, y: -1}, {x: 0, y: 1});
                break;
            case '-':
                pipe.ends.push({x: -1, y: 0}, {x: 1, y: 0});
                break;
            case 'L':
                pipe.ends.push({x: 0, y: -1}, {x: 1, y: 0});
                break;
            case 'J':
                pipe.ends.push({x: -1, y: 0}, {x: 0, y: -1});
                break;
            case '7':
                pipe.ends.push({x: -1, y: 0}, {x: 0, y: 1});
                break;
            case 'F':
                pipe.ends.push({x: 1, y: 0}, {x: 0, y: 1});
                break;
        }
        parsed.push(pipe);
    }
    return parsed;
});

function generateEmptyScheme() {
    let emptyScheme: (Pipe | null)[][] = [];
    for (let i = 0; i < map.length; i += 1) {
        emptyScheme.push([...emptySchemeRow]);
    }
    return emptyScheme;
}

let scheme: (Pipe | null)[][] = [];
function go(): void {
    for (const startingDirection of directions) {
        let x = sx;
        let y = sy;
        let d: XY | null = startingDirection;
        scheme = generateEmptyScheme();

        do {
            scheme[y][x] = map[y][x];
            x += d.x;
            y += d.y;
            if (x === sx && y === sy) {
                map[sy][sx].ends.push(startingDirection, {x: -d.x, y: -d.y});
                scheme[sy][sx] = map[sy][sx];
                return;
            }
            d = findNextDirection(x, y, d);
        } while (d !== null);
    }

    throw new Error('You are not supposed to be here');
}

function findNextDirection(x: number, y: number, d: XY): XY | null {
    if (x < 0 || y < 0 || x > mapW || y > mapH) {
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


go();


function ex(coordinate: number): number {
    return coordinate * 2 + 1;
}

const extendedScheme: string[][] = [];
for (let i = 0; i < ex(map.length); i += 1) {
    extendedScheme.push(new Array(ex(rows[0].length)).fill(' '));
}

scheme.forEach((row, y) => {
    row.forEach((tile, x) => {
        if (tile !== null) {
            extendedScheme[ex(y)][ex(x)] = '#';
            if (tile.ends[0].x === 1 || tile.ends[1].x === 1) {
                extendedScheme[ex(y)][ex(x) + 1] = '#';
            }
            if (tile.ends[0].y === 1 || tile.ends[1].y === 1) {
                extendedScheme[ex(y) + 1][ex(x)] = '#';
            }
        }
    });
});

const exW = extendedScheme[0].length - 1;
const exH = extendedScheme.length - 1;
const knownTiles: number[] = [0];
const tilesToExplore: XY[] = [{ x: 0, y: 0}];
let tile: XY | undefined;
do {
    tile = tilesToExplore.pop();
    if (tile !== undefined) {
        extendedScheme[tile.y][tile.x] = 'O';
        for (const d of directions) {
            const xd = tile.x + d.x;
            const yd = tile.y + d.y;
            if (xd < 0 || yd < 0 || xd > exW || yd > exH) {
                continue;
            }
            if (extendedScheme[yd][xd] === '#') {
                continue;
            }
            const tileIndex = xd + yd * extendedScheme[0].length;
            if (knownTiles.includes(tileIndex)) {
                continue;
            }
            knownTiles.push(tileIndex);
            tilesToExplore.push({ x: xd, y: yd});
        }
    }
} while (tile !== undefined);

let enclosed = 0;
scheme.forEach((row, y) => {
    row.forEach((tile, x) => {
        if (tile === null && extendedScheme[ex(y)][ex(x)] === ' ') {
            enclosed += 1;
        }
    });
});

console.log(enclosed);