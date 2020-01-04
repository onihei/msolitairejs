import BitBuffer from './bit-buffer.js'

export default class ByteArraySource {

    constructor(byteArray) {
        if (byteArray instanceof Uint8Array) {
            this.rawData = byteArray;
        }
        this.fp = 0;
    }

    readRaw(bytes) {
        let raw = this.rawData.slice(this.fp, this.fp + bytes);
        this.fp += bytes;
        return raw;
    }

    readInt() {
        return this.readByte() |
            this.readByte() << 8 |
            this.readByte() << 16 |
            this.readByte() << 24;
    }

    readShort() {
        return (this.readByte()<<16 | this.readByte() << 24)>>16;
    }

    readUnsignedShort() {
        return this.readByte() | this.readByte() << 8;
    }

    readByte() {
        let val = this.rawData[this.fp];
        this.fp ++;
        return val;
    }

    skip(bytes) {
        this.fp += bytes;
    }

    readFloat() {
        let bytes = this.readRaw(4);
        let bin =  String.fromCharCode(bytes[0]) + String.fromCharCode(bytes[1]) + String.fromCharCode(bytes[2]) + String.fromCharCode(bytes[3]);
        return ByteArraySource.decodeFloat(bin, 23, 8);
    }

    static decodeFloat(data, precisionBits, exponentBits){
        let b = new BitBuffer(false, data).checkBuffer(precisionBits + exponentBits + 1),
            bias = Math.pow(2, exponentBits - 1) - 1, signal = b.readBits(precisionBits + exponentBits, 1),
            exponent = b.readBits(precisionBits, exponentBits), significand = 0,
            divisor = 2, curByte = b.buffer.length + (-precisionBits >> 3) - 1,
            byteValue, startBit, mask;
        do
            for(byteValue = b.buffer[ ++curByte ], startBit = precisionBits % 8 || 8, mask = 1 << startBit;
                mask >>= 1; (byteValue & mask) && (significand += 1 / divisor), divisor *= 2);
        while(precisionBits -= startBit);
        return exponent === (bias << 1) + 1 ? significand ? NaN : signal ? -Infinity : +Infinity
            : (1 + signal * -2) * (exponent || significand ? !exponent ? Math.pow(2, -bias + 1) * significand
            : Math.pow(2, exponent - bias) * (1 + significand) : 0);
    }
}
