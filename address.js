
export default class Address {

    constructor(x, y , h) {
        this.x = x;
        this.y = y;
        this.h = h;
    }

    offset(offsX, offsY, offsH) {
        return new Address(this.x + offsX, this.y + offsY, this.h + offsH);
    }

    equals(other) {
        return this.x === other.x && this.y === other.y && this.h === other.h;
    }

    marshal() {
        return [this.x, this.y, this.h].join(':');
    }

    static unmarshal(serialized) {
        let values = serialized.split(':');
        return new Address(Number(values[0]), Number(values[1]), Number(values[2]));
    }
}
