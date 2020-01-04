import Address from "./address.js";

const prefix = 'msolitairejs';

export default class Repository {

    static getCurrentLevel() {
        return Number(localStorage.getItem(`${prefix}.currentLevel`) || '0');
    }

    static setCurrentLevel(level) {
        localStorage.setItem(`${prefix}.currentLevel`, level);
        this.setSteps([]);

        let reached = this.getReachedLevel();
        if (level > reached) {
            this.setReachedLevel(level);
        }
    }

    static getReachedLevel() {
        return Number(localStorage.getItem(`${prefix}.reachedLevel`) || '0');
    }

    static setReachedLevel(level) {
        localStorage.setItem(`${prefix}.reachedLevel`, level);
    }

    static getSteps() {
        let steps = localStorage.getItem(`${prefix}.steps`);
        if (!steps) {
            return [];
        }
        return steps.split(',').map(s => Address.unmarshal(s));
    }

    static setSteps(addresses) {
        let serialized = addresses.map(address => address.marshal()).join(',');
        localStorage.setItem(`${prefix}.steps`, serialized);
    }

    static addStep(address) {
        let steps = this.getSteps();
        steps.push(address);
        this.setSteps(steps);
    }
}
