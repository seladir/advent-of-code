import { readFileSync } from 'fs';

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

const slopes = { '>': { x: 1, y: 0 }, 'v': { x: 0, y: 1 } };

const map = readFileSync('full.txt', 'utf8').split('\n').map(row => row.split(''));
const width = map[0].length;
const height = map.length;
const fx = width - 2;
const fy = height - 1;

let longestPath: number[] = [];
function go(path: number[], sx: number, sy: number): void {
    let x = sx;
    let y = sy;
    do {
        path.push(x + y * width);
        let ds: XY[] = [];
        if (map[y][x] === '>') {
            ds.push(slopes['>']);
        } else if (map[y][x] === 'v') {
            ds.push(slopes['v']);
        } else {
            for (const d of directions) {
                const dx = x + d.x;
                const dy = y + d.y;

                if (dx < 0 || dx >= width || dy < 0 || dy >= height) {
                    continue;
                }
                if (map[dy][dx] === '#') {
                    continue;
                }

                ds.push(d);
            }
        }

        ds = ds.filter(d => !path.includes((x +d.x) + (y + d.y) * width));

        if (!ds.length) {
            return;
        }

        if (ds.length > 1) {
            for (const d of ds.slice(1)) {
                go([...path], x + d.x, y + d.y);
            }
        }

        x += ds[0].x;
        y += ds[0].y;
    } while (x !== fx || y !== fy);
    path.push(x + y * width);

    if (path.length > longestPath.length) {
        longestPath = path;
    }
}

go([], 1, 0);
console.log(longestPath.length - 1);