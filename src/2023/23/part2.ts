import { readFileSync } from 'fs';

type XY = {
    x: number;
    y: number;
}

type Node = {
    self: number;
    weight: number;
    links: number[];
    path: number[];
}

type GoParams = {
    node: Node;
    x: number;
    y: number;
}

const directions: XY[] = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
];

const map = readFileSync('full.txt', 'utf8').split('\n').map(row => row.split(''));
const width = map[0].length;
const height = map.length;
const fx = width - 2;
const fy = height - 1;

const graph = new Map<number, Node>();
let nodeCounter = 1;
let finishNodeIndex = 0;
let path: number[] = [];
const params: GoParams[] = [];
function go(parentNode: Node, sx: number, sy: number): void {
    let x = sx;
    let y = sy;

    if (x === fx && y === fy) {
        finishNodeIndex = parentNode.self;
        return;
    }

    const ds: XY[] = [];

    for (const d of directions) {
        const dx = x + d.x;
        const dy = y + d.y;

        if (dx < 0 || dx >= width || dy < 0 || dy >= height) {
            continue;
        }
        if (map[dy][dx] === '#') {
            continue;
        }
        const mapIndex = dx + dy * width;
        if (path.includes(mapIndex)) {
            for (const [i, node] of graph) {
                if (i !== parentNode.self && node.path.includes(mapIndex)) {
                    node.links.push(parentNode.self);
                    parentNode.links.push(node.self);
                }
            }
            continue;
        }

        ds.push({ x: dx, y: dy });
    }

    if (!ds.length) {
        return;
    }

    for (const d of ds) {
        const mapIndex = d.x + d.y * width;
        nodeCounter += 1;
        const node: Node = {
            self: nodeCounter,
            weight: 0,
            links: [parentNode.self],
            path: [mapIndex],
        }
        path.push(mapIndex);
        graph.set(nodeCounter, node);
        parentNode.links.push(nodeCounter);
        params.push({ node, x: d.x, y: d.y });
    }
}

function process() {
    let param: GoParams | undefined;
    do {
        param = params.shift();
        if (param !== undefined) {
            go(param.node, param.x, param.y);
        }
    } while (param !== undefined);
}

const startNode: Node = {
    self: 1,
    weight: 0,
    links: [],
    path: [1],
}
graph.set(1, startNode);
path.push(1);
params.push({ node: startNode, x: 1, y: 0 });
process();

let allw = 0;
for (const [_, node] of graph) {
    node.links = [...new Set(node.links)];
    node.weight = node.path.length;
    node.path = [];
    allw += node.weight;
}
// console.log(allw);
//
// console.log(finishNodeIndex);
// console.log(graph);

for (let i = 1; i <= nodeCounter; i += 1) {
    const node = graph.get(i);
    if (node === undefined) {
        continue;
    }
    if (node.links.length === 2) {
        const firstNode = graph.get(node.links[0]) as Node;
        if (firstNode.links.length !== 2) {
            continue;
        }
        const secondNode = graph.get(node.links[1]) as Node;
        if (secondNode.links.length !== 2) {
            continue;
        }
        const nodeIndexFirst = firstNode.links.findIndex(value => value === node.self);
        const nodeIndexSecond = secondNode.links.findIndex(value => value === node.self);
        firstNode.links[nodeIndexFirst] = secondNode.self;
        secondNode.links[nodeIndexSecond] = firstNode.self;
        firstNode.weight += 1;
        graph.delete(node.self);
    }
}

console.log(graph.size);

let longestPath = 0;
function dfs(node: Node, weight: number, seen: number[]) {
    weight += node.weight;
    seen.push(node.self);
    if (node.self === finishNodeIndex) {
        if (longestPath < weight) {
            longestPath = weight;
        }
        return;
    }

    for (const link of node.links) {
        if (!seen.includes(link)) {
            const nodeToGo = graph.get(link) as Node;
            dfs(nodeToGo, weight, [...seen]);
        }
    }
}

dfs(startNode, 0, []);
console.log(longestPath - 1);