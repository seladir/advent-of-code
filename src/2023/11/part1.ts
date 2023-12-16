import { readFileSync } from 'fs';

type XY = {
    x: number;
    y: number;
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const galaxies: XY[] = [];
const emptyRows: number[] = [];
const emptyColumns: number[] = [];

for (let y = 0; y < rows.length; y += 1) {
    let isEmptyRow = true;
    for (let x = 0; x < rows[0].length; x += 1) {
        if (rows[y][x] === '#') {
            isEmptyRow = false;
            galaxies.push({ x, y });
        }
    }
    if (isEmptyRow) {
        emptyRows.push(y);
    }
}

for (let x = 0; x < rows[0].length; x += 1) {
    let isEmptyColumn = true;
    for (let y = 0; y < rows.length; y += 1) {
        if (rows[y][x] === '#') {
            isEmptyColumn = false;
            break;
        }
    }
    if (isEmptyColumn) {
        emptyColumns.push(x);
    }
}

galaxies.forEach((galaxy, i) => {
   let expandRows = 0;
   let expandColumns = 0;
   for (const emptyRow of emptyRows) {
       if (emptyRow < galaxy.y) {
           expandRows += 1;
       }
   }
   for (const emptyColumn of emptyColumns) {
       if (emptyColumn < galaxy.x) {
           expandColumns += 1;
       }
   }
   galaxies[i] = {
       x: galaxy.x + expandColumns,
       y: galaxy.y + expandRows,
   }
});

let sum = 0;
for (let i = 0; i < galaxies.length - 1; i += 1) {
    for (let j = i + 1; j < galaxies.length; j += 1) {
        sum += Math.abs(galaxies[i].x - galaxies[j].x) + Math.abs(galaxies[i].y - galaxies[j].y);
    }
}
console.log(sum);