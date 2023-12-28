import { readFileSync } from 'fs';

type ModuleType = '%' | '&' | 'b';

type Module = {
    type: 'flip' | 'con' | 'broad';
    outputs: string[];
    state: boolean;
    memory: Map<string, boolean>;
}

type Pulse = {
    type: boolean;
    from: string;
    to: string;
}

const rows = readFileSync('full.txt', 'utf8').split('\n');
const modules = new Map<string, Module>();
for (const row of rows) {
    const parts = row.replace(/\s/g, '').split('->');
    const outputs = parts[1].split(',');

    let moduleName = parts[0] === 'broadcaster' ? 'broadcaster' : parts[0].slice(1);
    const moduleType = parts[0][0] as ModuleType;
    const module: Module = {
        type: moduleType === 'b' ? 'broad' : (moduleType === '%' ? 'flip' : 'con'),
        outputs,
        state: false,
        memory: new Map<string, boolean>(),
    }
    modules.set(moduleName, module);
}

for (const [moduleName, module] of modules) {
    for (const output of module.outputs) {
        const outputModule = modules.get(output);
        if (outputModule !== undefined && outputModule.type === 'con') {
            outputModule.memory.set(moduleName, false);
        }
    }
}

const broadcaster = modules.get('broadcaster') as Module;
const pipeline: Pulse[] = [];

let counter = 0;
let gotIt = false;

const accs = {
    pv: 0,
    qh: 0,
    xm: 0,
    hz: 0,
}

function sendPulse(pulse: Pulse): void {
    if (pulse.to === 'rx' && !pulse.type) {
        gotIt = true;
    }
    if (pulse.to === 'kh') {
        if (pulse.type) {
            // @ts-ignore
            console.log(pulse.from, counter - accs[pulse.from]);
            // @ts-ignore
            accs[pulse.from] = counter;
        }
    }
    pipeline.push(pulse);
}

function sendPulsesToOutputs(from: string, outputs: string[], pulseType: boolean): void {
    for (const output of outputs) {
        sendPulse({
            type: pulseType,
            from,
            to: output,
        })
    }
}

function process() {
    while (pipeline.length && !gotIt) {
        const pulse = pipeline.shift() as Pulse;
        const module = modules.get(pulse.to);
        if (module === undefined) {
            continue;
        }

        if (module.type === 'flip') {
            if (pulse.type) {
                continue;
            }

            module.state = !module.state;
            sendPulsesToOutputs(pulse.to, module.outputs, module.state);
        } else {
            module.memory.set(pulse.from, pulse.type);
            let conState = true;
            for (const [_, value] of module.memory) {
                conState = conState && value;
            }
            sendPulsesToOutputs(pulse.to, module.outputs, !conState);
        }
    }
}

while (!gotIt) {
    counter += 1;
    sendPulsesToOutputs('broadcaster', broadcaster.outputs, false);
    process();
}
console.log(counter);