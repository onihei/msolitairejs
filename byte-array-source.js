
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
        let i = this.readInt();
        let buffer = new ArrayBuffer(4);
        let intView = new Int32Array(buffer);
        let floatView = new Float32Array(buffer);
        intView[0] = i;
        return floatView[0];
    }
}
