import View from './view.js'

export default class Pai extends View {

    constructor(props, address) {
        super(props);
        this.address = address;
        this.name = null;
        this.emf = null;
        this.selected = false;
    }

}
