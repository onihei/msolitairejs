import Scene from './scene.js'
import Assets from './assets.js'
import Emf from './emf.js'
import EmfSprite from './emf-sprite.js'
import Engine from './engine.js'
import Audio from "./audio.js"
import LevelProgress from "./level-progress.js"

export default class Success extends Scene {

    constructor() {
        super();
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
                Audio.load('success', data);
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
        Engine.addScene('levelProgress', new LevelProgress())
            .then(() => {
                Engine.setCurrentSceneName('levelProgress');
            });
    }

    onEnter() {
        super.onEnter();
        Audio.stop();
        Audio.play('success', true);
    }
}
