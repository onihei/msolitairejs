import Scene from './scene.js'
import Assets from './assets.js'
import Emf from './emf.js'
import EmfSprite from './emf-sprite.js'
import Repository from "./repository.js";
import Stage from "./stage.js";

export default class Failure extends Scene {

    constructor(engine, audio, props = {}) {
        super(engine, audio, props);
    }

    async init() {
        await Promise.all([
            // timer
            new Promise((resolve, reject) => {
                setTimeout(()=> {
                    resolve();
                }, 3000);
            }),
            Assets.loadAudio('./sound/failure.m4a').then((data) => {
                this.audio.load('failure', data);
            }),
            Assets.loadRaw('./drawable/failure.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), this.width, this.height, true);
                emf.left = (this.width - emf.width) / 2;
                emf.top = (this.height - emf.height) / 2;

                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/retry.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 200, 70, true);
                emf.left = (this.width - emf.width) / 2;
                emf.top = 300;
                emf.order = 2;
                emf.setOnClickListener(()=>{
                    this.doRetry();
                });
                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/retire.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 200, 70, true);
                emf.left = (this.width - emf.width) / 2;
                emf.top = 380;
                emf.order = 2;
                emf.setOnClickListener(()=>{
                    this.doRetire();
                });
                this.addChild(emf);
            }),
        ]);
    }

    onEnter() {
        super.onEnter();
        this.audio.stop();
        this.audio.play('failure', true);
    }

    doRetry() {
        const level = Repository.getCurrentLevel();
        this.engine.addScene('stage', new Stage(this.engine, this.audio, level))
            .then(() => {
                this.engine.setCurrentSceneName('stage');
            });
    }

    doRetire() {
        this.audio.stop();
        this.engine.setCurrentSceneName('title');
    }
}
