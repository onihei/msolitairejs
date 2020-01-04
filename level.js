import ByteArraySource from './byte-array-source.js'
import Pai from './pai.js'
import PaiSet from './pai-set.js'
import Address from './address.js'
import ArrayUtils from './array-utils.js'
import MersenneTwister from "./mersenne-twister.js";
import Repository from "./repository.js";

export default class Level {

    constructor(fmfBytes, seed) {
        let is = new ByteArraySource(fmfBytes);
        is.readInt();// magic number
        is.readInt();// size
        this.width = is.readInt();
        this.height = is.readInt();
        is.skip(4);

        MersenneTwister.seed(seed);
        let array = is.readRaw(this.width * this.height * 5);

        this.tmpPaiSet = this.createPaiSet(array);
        // 確実に取り除ける順をバックトラックで探索してpaiSetに移動する
        this.paiSet = new PaiSet();
        this.backtrack(0);

        this.paiSet.updateMark();
    }

    createPaiSet(array) {
        let width = this.width;
        let height =  this.height;
        let pais = [];
        let pCnt = 0; // 牌カウンタ
        for (let h = 0; h < 5; h++) {
            let length = 0;
whileLoop:	while(true) {
                for (let i = 0; i <= length; i++) {
                    let x = i;
                    let y = length - i;

                    if (x >= width) continue;
                    if (y >= height) continue;
                    let index = h*(height*width) + y*width + x;
                    let n = array[index];
                    // レベルエディタが出力する牌の値を判定（高さ毎に色を変えているため対象は５種）
                    if (n === 0 || n === 2 || n === 4 || n === 6 || n === 8) {
                        pais.push(new Pai({order: pCnt}, new Address(x, y, h)));
                        pCnt++;
                    }
                    if (x === width-1 && y === height-1) {
                        break whileLoop;
                    }
                }
                length++;
            }
        }
        if (pCnt % 2 !== 0 || pCnt > 144) {
            throw 'Level Error';
        }
        return new PaiSet(pais);
    }

    backtrack(nPai) {
        if (this.tmpPaiSet.isEmpty()) {
            return true;
        }
        let selectableList = this.tmpPaiSet.getSelectableList();
        if (selectableList.length < 2) {
            return false;
        }
        ArrayUtils.shuffleArray(selectableList);
        for (let j = 0; j < selectableList.length-1; j++) {
            for (let k = j + 1; k < selectableList.length; k++) {
                if (j !== k) {
                    // 牌をとる
                    let pai1 = selectableList[j];
                    let pai2 = selectableList[k];
                    this.tmpPaiSet.remove(pai1);
                    this.tmpPaiSet.remove(pai2);
                    this.paiSet.pais.push(pai1);
                    this.paiSet.pais.push(pai2);

                    if (this.backtrack(nPai + 2)) {
                        return true;
                    }

                    // 牌を戻す
                    this.tmpPaiSet.add(pai1);
                    this.tmpPaiSet.add(pai2);
                    this.paiSet.pais.pop();
                    this.paiSet.pais.pop();
                }
            }
        }
        return false;
    }

    recordStep(pai1, pai2) {
        Repository.addStep(pai1.address);
        Repository.addStep(pai2.address);
    }

    restoreSteps() {
        Repository.getSteps().forEach(address=> {
            this.paiSet.removeByAddress(address);
        });
    }
}
