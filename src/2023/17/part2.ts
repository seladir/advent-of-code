import { readFileSync } from 'fs';

type Loss = {
    dx: number;
    dy: number;
    long: number;
    loss: number;
}

type Block = {
    itsLoss: number;
    minLosses: Loss[];
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const side = rows.length;
const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const city: Block[][] = [];
for (const row of rows) {
    city.push(
        row.split('').map(char => ({ itsLoss: Number(char), minLosses: [] }))
    );
}

let minLoss = 0;
for (let i = 1; i < side; i += 1) {
    minLoss += city[i][i].itsLoss + city[i - 1][i].itsLoss;
}

function go(x: number, y: number, loss: Loss) {
    if (x === -1 || y === -1 || x === side || y === side) {
        return;
    }

    const newLoss = loss.loss + city[y][x].itsLoss;
    if (newLoss >= minLoss) {
        return;
    }

    if (x === side - 1 && y === side - 1 && loss.long >= 4) {
        if (newLoss < minLoss) {
            minLoss = newLoss;
        }
        return;
    }

    const previousMinLossIndex = city[y][x].minLosses.findIndex(minLoss => minLoss.dx === loss.dx && minLoss.dy === loss.dy && minLoss.long === loss.long);
    if (previousMinLossIndex === -1) {
        city[y][x].minLosses.push({
            ...loss,
            loss: newLoss,
        });
    } else {
        if (city[y][x].minLosses[previousMinLossIndex].loss <= newLoss) {
            return;
        }

        city[y][x].minLosses[previousMinLossIndex].loss = newLoss;
    }

    if (loss.long < 4) {
        go(x + loss.dx, y + loss.dy, { dx: loss.dx, dy: loss.dy, long: loss.long + 1, loss: newLoss });
        return;
    }

    for (const [dx, dy] of directions) {
        if ((dx !== 0 && dx + loss.dx === 0) || (dy !== 0 && dy + loss.dy === 0)) {
            continue;
        }

        const isSameDirection = loss.dx === dx && loss.dy === dy;
        if (!isSameDirection || loss.long < 10) {
            go(x + dx, y + dy, { dx, dy, long: isSameDirection ? loss.long + 1 : 1, loss: newLoss });
        }
    }
}

go(1, 0, { dx: 1, dy: 0, long: 1, loss: 0 });
go(0, 1, { dx: 0, dy: 1, long: 1, loss: 0 });

console.log(minLoss);