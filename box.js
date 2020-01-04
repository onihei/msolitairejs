
export default class Box {

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    calcContainBox(frameWidth, frameHeight) {
        let aspect = this.height / this.width;
        if (frameHeight / frameWidth > aspect) {
            return new Box(frameWidth, frameWidth * aspect);
        } else {
            return new Box(frameHeight / aspect, frameHeight);
        }
    }
}
