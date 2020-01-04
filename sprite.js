import View from './view.js'
import Box from "./box.js";

export default class Sprite extends View {

    constructor(image, width, height, keepAspect = false) {
        super();
        this.image = image;
        this.width = image.width;
        this.height = image.height;

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
