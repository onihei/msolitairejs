
const N = 624;
const M = 397;
const UPPER_MASK = 0x80000000;
const LOWER_MASK = 0x7fffffff;
const MATRIX_A = 0x9908b0df;
let x = [];
let p, q, r;

export default class MersenneTwister {

    static seed(s/*uint*/) {
        x[0] = s;
        for (let i = 1; i < N; i++) {
            x[i] = this.imul(1812433253, x[i - 1] ^ (x[i - 1] >>> 30)) + i;
            x[i] &= 0xffffffff;
        }
        p = 0;
        q = 1;
        r = M;
    }

    static nextNumber() {
        return this.next(32) / 4294967296;
    }

    static next(bits) {
        let y = (x[p] & UPPER_MASK) | (x[q] & LOWER_MASK);
        x[p] = x[r] ^ (y >>> 1) ^ ((y & 1) * MATRIX_A);
        y = x[p];

        if (++p === N) {p = 0;}
        if (++q === N) {q = 0;}
        if (++r === N) {r = 0;}

        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> (32 - bits);
    }

    static imul(a, b) {
        let al = a & 0xffff;
        let ah = a >>> 16;
        let bl = b & 0xffff;
        let bh = b >>> 16;
        let ml = al * bl;
        let mh = ((((ml >>> 16) + al * bh) & 0xffff) + ah * bl) & 0xffff;

        return (mh << 16) | (ml & 0xffff);
    }
}

MersenneTwister.seed(0);
