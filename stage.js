import Scene from './scene.js'
import Assets from './assets.js'
import Level from './level.js'
import View from './view.js'
import Engine from './engine.js'
import Emf from "./emf.js";
import Box from './box.js'
import EmfSpriteRenderer from "./emf-sprite-renderer.js";
import Success from "./success.js";
import Failure from "./failure.js";
import Audio from "./audio.js";
import Sprite from "./sprite.js";
import EmfSprite from "./emf-sprite.js";
import ArrayUtils from "./array-utils.js";
import Repository from "./repository.js";
import Pai from "./pai.js";
import LevelConfig from "./level-config.js";
import Ending from "./ending.js";

let mark;
let shadow;

export default class Stage extends Scene {

    constructor(levelNumber = 0, resume = false) {
        super();
        this.resume = resume;
        this.levelNumber = levelNumber;
        this.menuEnabled = false;
        this.selectedPai = null;
    }

    async init() {
        let levelConfig = new LevelConfig(this.levelNumber);

        await Promise.all([
            Assets.loadImage('./background/bg' + this.levelNumber + '.jpg').then((image) => {
                let bg = new Sprite(image);
                bg.order = -1;
                this.addChild(bg);
            }),
            Assets.loadAudio('./sound/stage.m4a').then((arrayBuffer) => {
                Audio.load('stage', arrayBuffer);
            }),
            Assets.loadAudio('./sound/select.aac').then((arrayBuffer) => {
                Audio.load('select', arrayBuffer);
            }),
            Assets.loadAudio('./sound/not_selectable.aac').then((arrayBuffer) => {
                Audio.load('not_selectable', arrayBuffer);
            }),
            Assets.loadRaw(levelConfig.fmfUrl).then((data) => {
                this.level = new Level(data, levelConfig.seed);
                if (this.resume) {
                    this.level.restoreSteps();
                }
            }),
            Assets.loadRaw('./pai/mark.emf').then((data) => {
                mark = new Emf(data);
            }),
            Assets.loadRaw('./pai/mask.emf').then((data) => {
                shadow = this.makeShadow(new Emf(data));
            }),
            Assets.loadRaw('./drawable/menu.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 80, 80, true);
                this.menu = emf;
                emf.left = 700;
                emf.top = 20;
                emf.order = 1000;
                emf.setOnClickListener(()=>{
                    setTimeout(()=>{
                        this.toggleMenu();
                        Engine.render();
                    }, 0);
                });
                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/hint.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 200, 70, true);
                this.hint = emf;
                emf.left = 580;
                emf.top = 120;
                emf.order = 1000;
                emf.visible = false;
                emf.setOnClickListener(()=>{
                    setTimeout(()=>{
                        this.showHint();
                        this.toggleMenu();
                        Engine.render();
                    }, 0);
                });
                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/pause.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 200, 70, true);
                this.pause = emf;
                emf.left = 580;
                emf.top = 220;
                emf.order = 1000;
                emf.visible = false;
                emf.setOnClickListener(()=>{
                    Audio.stop();
                    Engine.setCurrentSceneName('title');
                });
                this.addChild(emf);
            }),
            Assets.loadRaw('./drawable/retry.emf').then((data) => {
                let emf = new EmfSprite(new Emf(data), 200, 70, true);
                this.retry = emf;
                emf.left = 580;
                emf.top = 320;
                emf.order = 1000;
                emf.visible = false;
                emf.setOnClickListener(()=>{
                    setTimeout(()=>{
                        this.doRetry();
                        this.toggleMenu();
                        Engine.render();
                    }, 0);
                });
                this.addChild(emf);
            }),
        ]);

        await this.level.paiSet.loadEmf();
        this.arrangePais();
    }

    onEnter() {
        super.onEnter();
        Audio.stop();
        Audio.play('stage', true);
    }

    arrangePais() {
        this.level.paiSet.pais.forEach(t=>{
            //(x - (x * p)) * (nh-1) + x = sh
            // (1-p)x * (nh-1) + x = sh
            // x ((1-p)* (nh-1) + 1) = sh
            // x = sh / ((1-p)* (nh-1) + 1)

            let nh = this.level.height / 2;
            let nw = this.level.width / 2;
            let ph = this.height / ((1-.2) * (nh-1) + 1);
            let pw = this.width / ((1-.08) * (nw-1) + 1);

            let paiBox = new Box(t.emf.header.width, t.emf.header.height).calcContainBox(pw, ph);
            let paiWidth = paiBox.width;
            let paiHeight = paiBox.height;
            let overlapX = paiWidth * .08;
            let overlapY = paiHeight * .2;
            let hOffsetX = overlapX * 2;
            let hOffsetY = overlapY;

            let paddingLeft = (this.width - (paiWidth * nw - overlapX * (nw -1))) / 2;
            let paddingTop = (this.height - (paiHeight * nh - overlapY * (nh -1))) / 2;

            t.width = paiWidth;
            t.height = paiHeight;
            t.left = t.address.x * ((paiWidth - overlapX)/ 2) - (t.address.h * hOffsetX) + paddingLeft;
            t.top = t.address.y * ((paiHeight - overlapY)/ 2) - (t.address.h * hOffsetY) + paddingTop;
            this.addChild(t);
        });
    }

    static shadowImage() {
        return shadow;
    }

    static markEmf() {
        return mark;
    }

    handleClick(event) {
        super.handleClick(event);

        let x = event.layerX;
        let y = event.layerY;

        // orderの降順でソート
        this.level.paiSet.pais.sort((a, b) => {
            return b.order - a.order
        });

        for (let i in this.level.paiSet.pais) {
            let pai = this.level.paiSet.pais[i];
            if (View.ptInRect(x, y, pai.left, pai.top, pai.width, pai.height)) {
                if (this.level.paiSet.isSelectable(pai)) {
                    this.selectPai(pai);
                } else {
                    Audio.play('not_selectable');
                }
                break;
            }
        }
        Engine.render();
    }

    selectPai(pai) {
        if (this.selectedPai === null) {
            this.level.paiSet.clearSelected();
            this.selectedPai = pai;
            pai.selected = true;
            Audio.play('select');
        } else if (this.selectedPai === pai) {
            this.level.paiSet.clearSelected();
            this.selectedPai = null;
        } else {
            if (this.selectedPai.name === pai.name) {
                this.level.paiSet.clearSelected();
                this.removePair(pai);
                this.checkGameOver();
            } else {
                Audio.play('not_selectable');
            }
        }
    }

    removePair(pai) {
        this.selectedPai.selected = false;

        let paiSet = this.level.paiSet;
        paiSet.remove(this.selectedPai);
        paiSet.remove(pai);

        this.removeChild(this.selectedPai);
        this.removeChild(pai);

        this.level.recordStep(this.selectedPai, pai);
        this.selectedPai = null;
    }

    checkGameOver() {
        if (this.isClear()) {
            if (this.levelNumber === LevelConfig.lastLevel()) {
                Repository.setCurrentLevel(this.levelNumber);
                Audio.stop();
                Engine.addScene('ending', new Ending())
                    .then(() => {
                        Engine.setCurrentSceneName('ending');
                    });
            } else {
                Repository.setCurrentLevel(this.levelNumber + 1);
                Engine.addScene('success', new Success())
                    .then(() => {
                        Engine.setCurrentSceneName('success');
                    });
            }
        } else if (this.isGameOver()) {
            Engine.addScene('failure', new Failure())
                .then(() => {
                    Engine.setCurrentSceneName('failure');
                });
        }
    }

    isClear() {
        return this.level.paiSet.pais.length === 0;
    }

    isGameOver() {
        let selectableList = this.level.paiSet.getSelectableList();
        for (let i = 0; i < selectableList.length; i++) {
            let p1 = selectableList[i];
            for (let j = 0; j < selectableList.length; j++) {
                let p2 = selectableList[j];
                if (i !== j && p1.name === p2.name) {
                    return false;
                }
            }
        }
        return true;
    }

    makeShadow(emf) {
        let shadowCanvas = window.document.createElement('canvas');
        shadowCanvas.width = emf.header.width * 2;
        shadowCanvas.height = emf.header.height * 2;

        let ctx2d = shadowCanvas.getContext('2d');
        ctx2d.save();
        ctx2d.translate(emf.header.width/2, emf.header.height/2);
        ctx2d.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx2d.shadowBlur = emf.header.width / 3;
        ctx2d.shadowOffsetX = emf.header.width/5;
        ctx2d.shadowOffsetY = emf.header.height/5;
        EmfSpriteRenderer.renderEmf(ctx2d, emf);
        ctx2d.restore();
        return shadowCanvas;
    }

    toggleMenu() {
        if (this.menuEnabled) {
            this.menuEnabled = false;
            this.hint.visible = false;
            this.pause.visible = false;
            this.retry.visible = false;
        } else {
            this.menuEnabled = true;
            this.hint.visible = true;
            this.pause.visible = true;
            this.retry.visible = true;
        }
    }

    showHint() {
        this.selectedPai = null;
        this.level.paiSet.clearSelected();
        let selectableList = this.level.paiSet.getSelectableList();
        ArrayUtils.shuffleArray(selectableList);
        for (let i = 0; i < selectableList.length; i++) {
            let p1 = selectableList[i];
            for (let j = 0; j < selectableList.length; j++) {
                let p2 = selectableList[j];
                if (i !== j && p1.name === p2.name) {
                    p1.selected = true;
                    p2.selected = true;
                    return;
                }
            }
        }
    }

    doRetry() {
        this.selectedPai = null;
        Repository.setCurrentLevel(this.levelNumber);
        this.children.filter(view => view instanceof Pai).forEach(v=>this.removeChild(v));

        let levelConfig = new LevelConfig(this.levelNumber);
        Assets.loadRaw(levelConfig.fmfUrl).then((data) => {
            this.level = new Level(data, levelConfig.seed);
            this.level.paiSet.loadEmf().then(() => {
                this.arrangePais();
                Engine.render();
            });
        });
    }
}
