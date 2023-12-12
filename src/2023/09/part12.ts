import { readFileSync } from 'fs';

const rows = readFileSync('full.txt', 'utf8').split('\n');
const parsed: number[][] = rows.map(row => row.split(' ').map(num => Number(num)));
const parsedReversed: number[][] = rows.map(row => row.split(' ').map(num => Number(num)).reverse());

function extrapolate(histories: number[][]): number {
    let sum = 0;
    for (const history of histories) {
        const layers: number[][] = [history];
        let currentLayer = history;
        let newLayer: number[] = [];
        let areZeros = true;
        do {
            areZeros = true;
            for (let i = 1; i < currentLayer.length; i += 1) {
                const newValue = currentLayer[i] - currentLayer[i - 1];
                newLayer.push(newValue);
                if (newValue !== 0) {
                    areZeros = false;
                }
            }
            if (!areZeros) {
                layers.push(newLayer);
                currentLayer = newLayer;
                newLayer = [];
            }
        } while (!areZeros);

        let nextValue = 0;
        for (let i = layers.length - 1; i >= 0; i -= 1) {
            nextValue += layers[i][layers[i].length - 1];
        }

        sum += nextValue;
    }

    return sum;
}

console.log('part 1: ' + extrapolate(parsed));
console.log('part 2: ' + extrapolate(parsedReversed));
