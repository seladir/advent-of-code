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

const pipeline: Pulse[] = [];
let counterLow = 0;
let counterHigh = 0;

function sendPulse(pulse: Pulse): void {
    if (pulse.type) {
        counterHigh += 1;
    } else {
        counterLow += 1;
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
    while (pipeline.length) {
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

const broadcaster = modules.get('broadcaster') as Module;
for (let i = 0; i < 1000; i += 1) {
    counterLow += 1;
    sendPulsesToOutputs('broadcaster', broadcaster.outputs, false);
    process();
}
console.log(counterLow * counterHigh);