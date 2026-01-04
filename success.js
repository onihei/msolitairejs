import Scene from './scene.js'
import Assets from './assets.js'
import Emf from './emf.js'
import EmfSprite from './emf-sprite.js'
import LevelProgress from "./level-progress.js"

export default class Success extends Scene {

    constructor(engine, audio, props = {}) {
        super(engine, audio, props);
    }

    async init() {
        await Promise.all([
            // timer
            new Promise((resolve, reject) => {
                setTimeout(()=> {
                    resolve();
                }, 2000);
            }),
            Assets.loadAudio('./sound/success.m4a').then((data) => {
                this.audio.load('success', data);
            }),
            Assets.loadRaw('./drawable/success.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), this.width, this.height, true);
                emf.left = (this.width - emf.width) / 2;
                emf.top = (this.height - emf.height) / 2;

                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/next.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 200, 70, true);
                emf.left = (this.width - emf.width) / 2;
                emf.top = 380;
                emf.order = 2;
                emf.setOnClickListener(() => {
                    this.goNext();
                });
                this.addChild(emf);
            }),
        ]);
    }

    goNext() {
        this.engine.addScene('levelProgress', new LevelProgress(this.engine, this.audio))
            .then(() => {
                this.engine.setCurrentSceneName('levelProgress');
            });
    }

    onEnter() {
        super.onEnter();
        this.audio.stop();
        this.audio.play('success', true);
    }
}
