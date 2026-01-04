import Scene from './scene.js'
import Assets from './assets.js'
import Emf from './emf.js'
import EmfSprite from './emf-sprite.js'
import Stage from './stage.js'
import LevelProgress from "./level-progress.js";
import Repository from "./repository.js";
import LevelSelect from "./level-select.js";

export default class Title extends Scene {

    constructor(engine, audio, props = {}) {
        super(engine, audio, props);
    }

    async init() {
        super.init();
        await Promise.all(
            [
            Assets.loadRaw('./drawable/title.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), this.width, this.height, true);
                emf.left = (this.width - emf.width) / 2;
                emf.top = (this.height - emf.height) / 2;

                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/start.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 200, 70, true);
                emf.left = 80;
                emf.top = 350;
                emf.order = 2;
                emf.setOnClickListener(()=>{
                    this.doStart();
                });
                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/continue.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 200, 70, true);
                emf.left = 300;
                emf.top = 350;
                emf.order = 2;
                emf.setOnClickListener(()=>{
                    this.doResume();
                });
                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/level-select.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 200, 70, true);
                emf.left = 520;
                emf.top = 350;
                emf.order = 2;
                emf.setOnClickListener(()=>{
                    this.doLevelSelect();
                });
                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/sound-on.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 80, 80, true);
                this.soundOn = emf;
                emf.left = 700;
                emf.top = 20;
                emf.order = 2;
                emf.visible = !this.audio.isMute();
                emf.setOnClickListener(()=>{
                    this.audio.setMute(true);
                    setTimeout(()=>{
                        this.soundOn.visible = false;
                        this.soundMute.visible = true;
                        this.engine.invalidate();
                    }, 0);
                });
                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/sound-mute.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 80, 80, true);
                this.soundMute = emf;
                emf.left = 700;
                emf.top = 20;
                emf.order = 2;
                emf.visible = this.audio.isMute();
                emf.setOnClickListener(()=>{
                    this.audio.setMute(false);
                    setTimeout(()=>{
                        this.soundOn.visible = true;
                        this.soundMute.visible = false;
                        this.engine.invalidate();
                    }, 0);
                });
                this.addChild(emf);
            })
            ]
        );
    }

    doStart() {
        Repository.setCurrentLevel(0);
        this.audio.resume();
        this.engine.addScene('levelProgress', new LevelProgress(this.engine, this.audio))
            .then(() => {
                this.engine.setCurrentSceneName('levelProgress');
            });
    }

    doResume() {
        const level = Repository.getCurrentLevel();
        this.audio.resume();
        this.engine.addScene('stage', new Stage(this.engine, this.audio, level, true))
            .then(() => {
                this.engine.setCurrentSceneName('stage');
            });
    }

    doLevelSelect() {
        this.audio.resume();
        this.engine.addScene('levelSelect', new LevelSelect(this.engine, this.audio))
            .then(() => {
                this.engine.setCurrentSceneName('levelSelect');
            });
    }
}
