import { readFileSync } from 'fs';

type Record = {
    map: string;
    groups: number[];
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const records: Record[] = [];
for (const row of rows) {
    const parts = row.split(' ');
    const groups = parts[1].split(',').map(group => Number(group));
    records.push({ map: parts[0], groups });
}

function evaluate(map: string, groups: number[]): number {
    if (!map.length || !groups.length) {
        return 0;
    }
    const neededLength = groups.reduce((acc, group) => acc + group + 1, 0) - 1;
    if (map.length < neededLength) {
        return 0;
    }

    const group = groups[0];
    const char = map[0];
    const rest = map.slice(1);

    if (char === '.') {
        return evaluate(rest, groups);
    }

    if (char === '#') {
        if (map.slice(0, group).includes('.')) {
            return 0;
        }
        if (groups.length === 1) {
            if (map.slice(group).includes('#')) {
                return 0;
            }

            return 1;
        }
        if (map[group] === '#') {
            return 0;
        }

        return evaluate(map.slice(group + 1), [...groups.slice(1)]);
    }

    return evaluate('.' + rest, groups) + evaluate('#' + rest, groups);
}

let sum = 0;
for (const record of records) {
    sum += evaluate(record.map, record.groups);
}
console.log(sum);