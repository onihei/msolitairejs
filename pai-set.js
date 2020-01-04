import ArrayUtils from './array-utils.js'
import Assets from "./assets.js";
import Emf from "./emf.js";

export default class PaiSet {

    constructor(pais = []) {
        this.pais = pais;
    }

    isSelectable(pai) {
        // left
        let existLeft = false;
        let existRight = false;
        existLeft |= this.isExist(pai.address.offset(-2, -1, 0));
        existLeft |= this.isExist(pai.address.offset(-2, 0, 0));
        existLeft |= this.isExist(pai.address.offset(-2, 1, 0));
        // Right
        existRight |= this.isExist(pai.address.offset(2, -1, 0));
        existRight |= this.isExist(pai.address.offset(2, 0, 0));
        existRight |= this.isExist(pai.address.offset(2, 1, 0));
        if (existLeft && existRight) {
            return false;
        }
        // Roof
        if (this.isExist(pai.address.offset(-1, -1, 1))) {
            return false
        }
        if (this.isExist(pai.address.offset(0, -1, 1))) {
            return false
        }
        if (this.isExist(pai.address.offset(1, -1, 1))) {
            return false
        }
        if (this.isExist(pai.address.offset(-1, 0, 1))) {
            return false
        }
        if (this.isExist(pai.address.offset(0, 0, 1))) {
            return false
        }
        if (this.isExist(pai.address.offset(1, 0, 1))) {
            return false
        }
        if (this.isExist(pai.address.offset(-1, 1, 1))) {
            return false
        }
        if (this.isExist(pai.address.offset(0, 1, 1))) {
            return false
        }
        if (this.isExist(pai.address.offset(1, 1, 1))) {
            return false
        }
        return true
    }

    isExist(address) {
        return this.pais.filter(pai => pai.address.equals(address)).length > 0;
    }

    isEmpty() {
        return this.pais.length === 0;
    }

    remove(pai) {
        this.pais = this.pais.filter(n => !n.address.equals(pai.address));
    }

    add(pai) {
        this.pais.push(pai);
    }

    updateMark() {

        let names = [
            'plant', 'season', 'white', 'green', 'red', 'n', 's', 'w', 'e',
            'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9',
            'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9',
            'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9',
        ];
        ArrayUtils.shuffleArray(names);
        names = names.reduce((acc, t) => acc.concat([t, t]), []);

        for (let i = 0; i < this.pais.length; i+=2) {
            this.pais[i].name = names[0];
            this.pais[i+1].name = names[0];
            names.splice(0, 1);
        }
    }

    loadEmf() {
        let plantNames = ArrayUtils.shuffleArray(['plum', 'orchis', 'mum', 'bamboo']);
        let seasonNames = ArrayUtils.shuffleArray(['spring', 'summer', 'autumn', 'winter']);
        return Promise.all(
            this.pais
                .map(t=> {
                    let name = t.name;
                    if (name === 'plant') {
                        name = plantNames[0];
                        plantNames.splice(0, 1)
                    }
                    if (name === 'season') {
                        name = seasonNames[0];
                        seasonNames.splice(0, 1)
                    }
                    return Assets.loadRaw('./drawable/pai/' + name + '.emf').then((data) => {
                        t.emf = new Emf(data);
                    })
                })
        );
    }

    getSelectableList() {
        return this.pais.filter(pai => this.isSelectable(pai));
    }

    clearSelected() {
        this.pais.forEach((pai)=> {
            pai.selected = false;
        });
    }

    removeByAddress(address) {
        this.pais = this.pais.filter(pai => !pai.address.equals(address));
    }
}
