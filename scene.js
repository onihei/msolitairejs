import View from './view.js'

export default class Scene extends View {

    constructor(engine, audio, props = {}) {
        super(props);
        this.engine = engine;
        this.audio = audio;
    }

    async init() {

    }

    onEnter() {

    }

    onLeave() {

    }
}
