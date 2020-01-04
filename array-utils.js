import MersenneTwister from './mersenne-twister.js'

export default class ArrayUtils {

    static shuffleArray(array) {
        let i = array.length;
        while (i--) {
            let j = Math.floor(MersenneTwister.nextNumber()*(i+1));
            let t = array[i];
            array[i] = array[j];
            array[j] = t;
        }
        return array;
    }

}
