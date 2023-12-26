import { readFileSync } from 'fs';

type Beam = {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const width = rows[0].length;
const height = rows.length;

function ev(startingBeam: Beam): number {
    const layout: string[][] = [];
    for (let i = 0; i < height; i += 1) {
        layout.push([]);
        for (let j = 0; j < width; j += 1) {
            layout[layout.length - 1].push(rows[i][j]);
        }
    }

    const energized = new Set<number>();
    const beams: Beam[] = [startingBeam];

    while (beams.length) {
        const beam = beams.pop() as Beam;
        const x = beam.x + beam.dx;
        const y = beam.y + beam.dy;

        if (x === -1 || y === -1 || x === width || y === height) {
            continue;
        }

        energized.add(x + y * width);

        switch (layout[y][x]) {
            case '\\': {
                const dx = beam.dx ? 0 : beam.dy;
                const dy = beam.dy ? 0 : beam.dx;
                beams.push({x, y, dx, dy});
            }
                break;
            case '/': {
                const dx = beam.dx ? 0 : -beam.dy;
                const dy = beam.dy ? 0 : -beam.dx;
                beams.push({x, y, dx, dy});
            }
                break;
            case '-': {
                if (beam.dx) {
                    beams.push({x, y, dx: beam.dx, dy: beam.dy});
                } else {
                    beams.push({x, y, dx: 1, dy: 0});
                    beams.push({x, y, dx: -1, dy: 0});
                    layout[y][x] = 'h';
                }
            }
                break;
            case '|': {
                if (beam.dy) {
                    beams.push({x, y, dx: beam.dx, dy: beam.dy});
                } else {
                    beams.push({x, y, dx: 0, dy: 1});
                    beams.push({x, y, dx: 0, dy: -1});
                    layout[y][x] = 'v';
                }
            }
                break;
            case 'h': {
                if (beam.dx) {
                    beams.push({x, y, dx: beam.dx, dy: beam.dy});
                }
            }
                break;
            case 'v': {
                if (beam.dy) {
                    beams.push({x, y, dx: beam.dx, dy: beam.dy});
                }
            }
                break;
            default:
                beams.push({x, y, dx: beam.dx, dy: beam.dy});
        }
    }

    return energized.size;
}

let maxEnergized = 0;
for (let k = 0; k < width; k += 1) {
    const newMax = Math.max(
        ev({ x: -1, y: k, dx: 1, dy: 0}),
        ev({ x: width, y: k, dx: -1, dy: 0}),
        ev({ x: k, y: -1, dx: 0, dy: 1}),
        ev({ x: k, y: height, dx: 0, dy: -1}),
    );
    if (newMax > maxEnergized) {
        maxEnergized = newMax;
    }
}

console.log(maxEnergized);