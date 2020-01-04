import Scene from './scene.js'
import Assets from './assets.js'
import Emf from './emf.js'
import EmfSprite from './emf-sprite.js'
import Engine from './engine.js'
import Stage from './stage.js'
import Audio from "./audio.js";
import LevelProgress from "./level-progress.js";
import Repository from "./repository.js";
import LevelSelect from "./level-select.js";

export default class Title extends Scene {

    constructor(props) {
        super(props);
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
                emf.visible = !Audio.isMute();
                emf.setOnClickListener(()=>{
                    Audio.setMute(true);
                    setTimeout(()=>{
                        this.soundOn.visible = false;
                        this.soundMute.visible = true;
                        Engine.render();
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
                emf.visible = Audio.isMute();
                emf.setOnClickListener(()=>{
                    Audio.setMute(false);
                    setTimeout(()=>{
                        this.soundOn.visible = true;
                        this.soundMute.visible = false;
                        Engine.render();
                    }, 0);
                });
                this.addChild(emf);
            })
            ]
        );
    }

    doStart() {
        Repository.setCurrentLevel(0);
        Audio.resume();
        Engine.addScene('levelProgress', new LevelProgress())
            .then(() => {
                Engine.setCurrentSceneName('levelProgress');
            });
    }

    doResume() {
        let level = Repository.getCurrentLevel();
        Audio.resume();
        Engine.addScene('stage', new Stage(level, true))
            .then(() => {
                Engine.setCurrentSceneName('stage');
            });
    }

    doLevelSelect() {
        Audio.resume();
        Engine.addScene('levelSelect', new LevelSelect())
            .then(() => {
                Engine.setCurrentSceneName('levelSelect');
            });
    }
}
