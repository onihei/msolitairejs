import Audio from './audio.js'
import Engine from './engine.js'
import SceneRenderer from './scene-renderer.js'
import EmfSpriteRenderer from './emf-sprite-renderer.js'
import PaiRenderer from './pai-renderer.js'
import Title from './title.js'
import RoundRectRenderer from "./round-rect-renderer.js";
import LabelRenderer from "./label-renderer.js";
import SpriteRenderer from "./sprite-renderer.js";

// 依存性注入パターンで初期化
const audio = new Audio();
const engine = new Engine(800, 480, 2);

// レンダラーの追加
engine.addRenderer(new SceneRenderer());
engine.addRenderer(new PaiRenderer());
engine.addRenderer(new EmfSpriteRenderer());
engine.addRenderer(new RoundRectRenderer());
engine.addRenderer(new LabelRenderer());
engine.addRenderer(new SpriteRenderer());

// タイトルシーンの追加（エンジンとオーディオを注入）
engine.addScene('title', new Title(engine, audio))
    .then(() => {
        engine.setCurrentSceneName('title');
        engine.startGameLoop();
    });
