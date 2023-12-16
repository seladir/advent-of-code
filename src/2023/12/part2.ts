import { readFileSync } from 'fs';

type Record = {
    map: string;
    groups: number[];
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const records: Record[] = [];
for (const row of rows) {
    const parts = row.split(' ');
    const map = (parts[0] + '?').repeat(5).slice(0, -1);
    const groupsRaw = (parts[1] + ',').repeat(5).slice(0, -1);
    const groups = groupsRaw.split(',').map(group => Number(group));
    records.push({ map, groups });
}

let dict = new Map<string, number>();

function memo(key: string, result: number): number {
    dict.set(key, result);
    return result;
}

function evaluate(map: string, groups: number[]): number {
    if (!map.length || !groups.length) {
        return 0;
    }
    const neededLength = groups.reduce((acc, group) => acc + group + 1, 0) - 1;
    if (map.length < neededLength) {
        return 0;
    }

    const key = map + groups.length;
    if (dict.has(key)) {
        return dict.get(key) as number;
    }

    const group = groups[0];
    const char = map[0];
    const rest = map.slice(1);

    if (char === '.') {
        return memo(key, evaluate(rest, groups));
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

        return memo(key, evaluate(map.slice(group + 1), [...groups.slice(1)]));
    }

    return memo(key, evaluate('.' + rest, groups) + evaluate('#' + rest, groups));
}

let sum = 0;
for (const record of records) {
    dict = new Map<string, number>();
    sum += evaluate(record.map, record.groups);
}
console.log(sum);