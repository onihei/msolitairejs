import Audio from './audio.js'
import Engine from './engine.js'
import SceneRenderer from './scene-renderer.js'
import EmfSpriteRenderer from './emf-sprite-renderer.js'
import PaiRenderer from './pai-renderer.js'
import Title from './title.js'
import RoundRectRenderer from "./round-rect-renderer.js";
import LabelRenderer from "./label-renderer.js";
import SpriteRenderer from "./sprite-renderer.js";

Audio.init();
Engine.init(800,480, 2);
Engine.addRenderer(new SceneRenderer());
Engine.addRenderer(new PaiRenderer());
Engine.addRenderer(new EmfSpriteRenderer());
Engine.addRenderer(new RoundRectRenderer());
Engine.addRenderer(new LabelRenderer());
Engine.addRenderer(new SpriteRenderer());

Engine.addScene('title', new Title())
    .then(() => {
        Engine.setCurrentSceneName('title');
    });
