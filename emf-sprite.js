import View from './view.js'
import Box from "./box.js";

export default class EmfSprite extends View {

    constructor(emf, width, height, keepAspect = false) {
        super();

        this.emf = emf;
        this.width = emf.header.width;
        this.height = emf.header.height;

        if (width && height) {
            if (keepAspect) {
                let box = new Box(this.width, this.height).calcContainBox(width, height);
                this.width = box.width;
                this.height = box.height;
            } else {
                this.width = width;
                this.height = height;
            }
        }
    }
}
