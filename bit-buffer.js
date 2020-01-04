
export default class BitBuffer {

    constructor(bigEndian, buffer) {
        this.bigEndian = bigEndian || 0;
        this.buffer = [];
        this.setBuffer(buffer);
    }

    readBits(start, length) {
        //shl fix: Henri Torgemane ~1996 (compressed by Jonas Raoni)
        function shl(a, b){
            for(++b; --b; a = ((a %= 0x7fffffff + 1) & 0x40000000) === 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1);
            return a;
        }
        if(start < 0 || length <= 0)
            return 0;
        this.checkBuffer(start + length);
        let sum = 0;
        for(let offsetLeft, offsetRight = start % 8, curByte = this.buffer.length - (start >> 3) - 1,
                lastByte = this.buffer.length + (-(start + length) >> 3), diff = curByte - lastByte,
                sum = ((this.buffer[ curByte ] >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1))
                    + (diff && (offsetLeft = (start + length) % 8) ? (this.buffer[ lastByte++ ] & ((1 << offsetLeft) - 1))
                        << (diff-- << 3) - offsetRight : 0); diff; sum += shl(this.buffer[ lastByte++ ], (diff-- << 3) - offsetRight)
        );
        return sum;
    }

    setBuffer(data) {
        if(data){
            for(let l, i = l = data.length, b = this.buffer = new Array(l); i; b[l - i] = data.charCodeAt(--i));
            this.bigEndian && b.reverse();
        }
    }

    hasNeededBits(neededBits) {
        return this.buffer.length >= -(-neededBits >> 3);
    }

    checkBuffer(neededBits) {
        if(!this.hasNeededBits(neededBits))
            throw new Error("checkBuffer::missing bytes");
        return this;
    }
}
