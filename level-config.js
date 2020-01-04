
let fmfNames = [];
let seeds = [];

function addLevel(name, seed) {
    fmfNames.push(name);
    seeds.push(seed);
}

addLevel('practice0', 0);
addLevel('practice1', 3);
addLevel('practice2', 8);
addLevel('short0', 1); // easy
addLevel('easy0', 0);
addLevel('short0', 0); // difficult
addLevel('normal0', 0);
addLevel('normal1', 0);
addLevel('normal2', 0);
addLevel('difficult0', 0);

addLevel('difficult1', 0);
addLevel('difficult2', 0);
addLevel('difficult3', 0);
addLevel('difficult4', 0);
addLevel('difficult5', 0);
addLevel('difficult6', 0);
addLevel('difficult7', 0);
addLevel('normal0', 1);
addLevel('normal1', 1);
addLevel('normal2', 1);

addLevel('difficult0', 2);
addLevel('difficult1', 2);
addLevel('difficult2', 2);

addLevel('practice0', 10);

export default class LevelConfig {

    constructor(levelNumber) {
        this.fmfUrl = './level/' + fmfNames[levelNumber] +'.fmf';
        this.seed = seeds[levelNumber];
    }

    static lastLevel() {
        return fmfNames.length - 1;
    }
}
