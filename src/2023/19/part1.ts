import { readFileSync } from 'fs';

type Category = 'x' | 'm' | 'a' | 's';
type Sign = '<' | '>';

type Part = {
    x: number;
    m: number;
    a: number;
    s: number;
}

type Rule = {
    category: Category | null;
    sign: Sign;
    value: number;
    jump: string;
}

const [workflowsRaw, partsRaw] = readFileSync('full.txt', 'utf8').split('\n\n');

const workflows = new Map<string, Rule[]>();
for (const row of workflowsRaw.split('\n')) {
    const [name, rulesString] = row.slice(0, -1).split('{');
    const rulesRaw = rulesString.split(',');
    const rules: Rule[] = [];
    for (let i = 0; i < rulesRaw.length; i += 1) {
        if (i !== rulesRaw.length - 1) {
            const [condition, jump] = rulesRaw[i].split(':');
            const category = condition[0] as Category;
            const sign = condition[1] as Sign;
            const value = Number(condition.slice(2));
            rules.push({ category, sign, value, jump });
        } else {
            rules.push({ category: null, sign: '<', value: 0, jump: rulesRaw[i]});
        }
    }
    workflows.set(name, rules);
}

const parts: Part[] = [];
for (const partRaw of partsRaw.split('\n')) {
    const categoriesRaw = partRaw.slice(1, -1).split(',');
    const part: Part = { x: 0, m: 0, a: 0, s: 0 };
    for (const categoryRaw of categoriesRaw) {
        part[categoryRaw[0] as Category] = Number(categoryRaw.slice(2));
    }
    parts.push(part);
}

function isAccepted(part: Part): boolean {
    let currentFlow = workflows.get('in');
    while (currentFlow !== undefined) {
        let jump = currentFlow[currentFlow.length - 1].jump;
        for (let i = 0; i < currentFlow.length - 1; i += 1) {
            const rule = currentFlow[i];
            if (rule.sign === '<') {
                if (part[rule.category as Category] < rule.value) {
                    jump = rule.jump;
                    break;
                }
            }
            if (rule.sign === '>') {
                if (part[rule.category as Category] > rule.value) {
                    jump = rule.jump;
                    break;
                }
            }
        }
        if (jump === 'A') return true;
        if (jump === 'R') return false;
        currentFlow = workflows.get(jump);
    }

    throw new Error('you are not supposed to be here');
}

let sum = 0;
for (const part of parts) {
    if (isAccepted(part)) {
        sum += part.x + part.m + part.a + part.s;
    }
}
console.log(sum);