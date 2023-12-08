import { readFileSync } from 'fs';

type Hand = {
    firstStrength: number;
    secondStrength: number;
    bid: number;
}

const labels = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();

const handsRaw: string[] = [];
const bids: number[] = [];
const rows = readFileSync('full.txt', 'utf8').split('\n');
rows.forEach((row) => {
    const [handRaw, bidRaw] = row.split(' ');
    handsRaw.push(handRaw);
    bids.push(Number(bidRaw));
});

const hands: Hand[] = [];
handsRaw.forEach((handRaw, handIndex) => {
    let firstStrength = 0;
    let secondStrength = 0;
    const dict: Record<string, number> = {};
    for (let i = 0; i < 5; i += 1) {
        const card = handRaw[i];
        if (!dict[card]) {
            dict[card] = 1;
        } else {
            dict[card] += 1;
        }

        const cardStrength = labels.findIndex(index => index === card);
        secondStrength += cardStrength * (13 ** (5 - i));
    }

    const repeats: number[] = [];
    let jokersCount = 0;
    for (const card in dict) {
       if (card === 'J') {
           jokersCount = dict[card];
       } else {
           repeats.push(dict[card]);
       }
    }

    if (repeats.length) {
        repeats.sort((a, b) => b - a);
        repeats[0] += jokersCount;
    } else {
        repeats.push(5);
    }
    for (const repeat of repeats) {
       firstStrength += 10 ** repeat;
    }

    hands.push({
        firstStrength,
        secondStrength,
        bid: bids[handIndex],
    });
});

hands.sort((a, b) => {
    if (a.firstStrength === b.firstStrength) {
        return a.secondStrength - b.secondStrength;
    }
    return a.firstStrength - b.firstStrength;
});

let total = 0;
hands.forEach((hand, i) => {
    total += hand.bid * (i + 1);
});

console.log(total);