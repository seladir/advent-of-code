import { readFileSync } from 'fs';

type Loss = {
    came: string;
    long: number;
    loss: number;
}

type Block = {
    itsLoss: number;
    minLosses: Loss[];
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const side = rows.length;

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

    if (x === side - 1 && y === side - 1 && newLoss < minLoss) {
        minLoss = newLoss;
        return;
    }

    const previousMinLossIndex = city[y][x].minLosses.findIndex(minLoss => minLoss.came === loss.came && minLoss.long === loss.long);
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

    if ((loss.came !== 'l' || loss.long < 3) && loss.came !== 'r') {
        go(x + 1, y, { came: 'l', long: loss.came === 'l' ? loss.long + 1 : 1, loss: newLoss });
    }
    if ((loss.came !== 'u' || loss.long < 3) && loss.came !== 'd') {
        go(x, y + 1, { came: 'u', long: loss.came === 'u' ? loss.long + 1 : 1, loss: newLoss });
    }
    if ((loss.came !== 'r' || loss.long < 3) && loss.came !== 'l') {
        go(x - 1, y, { came: 'r', long: loss.came === 'r' ? loss.long + 1 : 1, loss: newLoss });
    }
    if ((loss.came !== 'd' || loss.long < 3) && loss.came !== 'u') {
        go(x, y - 1, { came: 'd', long: loss.came === 'd' ? loss.long + 1 : 1, loss: newLoss });
    }
}

go(1, 0, { came: 'l', long: 1, loss: 0 });
go(0, 1, { came: 'u', long: 1, loss: 0 });

console.log(minLoss);