import Scene from './scene.js'
import Assets from './assets.js'
import RoundRect from './round-rect.js'
import Engine from './engine.js'
import Stage from './stage.js'
import Audio from "./audio.js";
import Label from "./label.js";
import Repository from "./repository.js";

export default class LevelProgress extends Scene {

    constructor() {
        super();
        this.currentLevel = Repository.getCurrentLevel();
        this.initStages();
    }

    async init() {
        super.init();
        await Assets.loadFont('gamefont', './font/FjallaOne-Regular.ttf');
    }

    initStages() {
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                let level = y * 10 + x;
                this.addStageRect(x, y, level);
            }
        }
    }

    addStageRect(x, y, level) {
        let color = {
            box: '#4C15FF',
            text: '#aAb6FF'
        };
        if (level < this.currentLevel) {
            color.box = '#777777';
            color.text = '#9E9E9E';
        } else if (level === this.currentLevel) {
            color.box = '#ffff00';
            color.text = '#ff0000';
        }

        let rectProps = {
            top: y * 48 + 4,
            left: x * 48 + 160,
            width: 40,
            height: 40,
            borderRadius: 5,
            borderWidth: 5,
            borderColor: '#8f8f8f',
            backgroundColor: color.box
        };
        let rect = new RoundRect(rectProps);

        let labelProps = {
            width: 40,
            height: 40,
            fontFamily: 'gamefont',
            fontSize: '32px',
            color: color.text,
            textBaseline: 'bottom',
            textAlign: 'center',
            text: level
        };
        rect.addChild(new Label(labelProps));
        this.addChild(rect);
    }

    handleClick(event) {
        super.handleClick(event);
        Engine.addScene('stage', new Stage(this.currentLevel))
            .then(() => {
                Engine.setCurrentSceneName('stage');
            })
            .catch(reason => {
                console.log(reason);
            });
    }

    onEnter() {
        super.onEnter();
        Audio.stop();
    }
}
