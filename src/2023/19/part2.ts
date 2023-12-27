import { readFileSync } from 'fs';

type Category = 'x' | 'm' | 'a' | 's';
type Sign = '<' | '>';

type Part = {
    x: { low: number, high: number },
    m: { low: number, high: number },
    a: { low: number, high: number },
    s: { low: number, high: number },
}

type Rule = {
    category: Category;
    sign: Sign;
    value: number;
    jump: string;
}

const [workflowsRaw,] = readFileSync('full.txt', 'utf8').split('\n\n');

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
            rules.push({ category: 'x', sign: '<', value: 0, jump: rulesRaw[i]});
        }
    }
    workflows.set(name, rules);
}

let sum = 0;

function process(part: Part, flowName: string) {
    if (flowName === 'A') {
        sum += (part.x.high - part.x.low + 1)
            * (part.m.high - part.m.low + 1)
            * (part.a.high - part.a.low + 1)
            * (part.s.high - part.s.low + 1);
        return;
    }
    if (flowName === 'R') {
        return;
    }

    let flow = workflows.get(flowName) as Rule[];

    let jump = flow[flow.length - 1].jump;
    for (let i = 0; i < flow.length - 1; i += 1) {
        const rule = flow[i];
        const partValues = part[rule.category];
        if (rule.sign === '<') {
            if (partValues.low >= rule.value) {
                continue;
            }
            if (partValues.high < rule.value) {
                process(part, rule.jump);
                return;
            }

            const satisfiedPart = { ...part };
            satisfiedPart[rule.category] = { low: partValues.low, high: rule.value - 1 };
            process(satisfiedPart, rule.jump);

            part[rule.category] = { low: rule.value, high: partValues.high };
        }
        if (rule.sign === '>') {
            if (partValues.high <= rule.value) {
                continue;
            }
            if (partValues.low > rule.value) {
                process(part, rule.jump);
                return;
            }

            const satisfiedPart = { ...part };
            satisfiedPart[rule.category] = { low: rule.value + 1, high: partValues.high };
            process(satisfiedPart, rule.jump);

            part[rule.category] = { low: partValues.low, high: rule.value };
        }
    }

    process(part, jump);
}

process({ x: { low: 1, high: 4000 }, m: { low: 1, high: 4000 }, a: { low: 1, high: 4000 }, s: { low: 1, high: 4000 } }, 'in');
console.log(sum);