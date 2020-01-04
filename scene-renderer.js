import Renderer from './renderer.js'
import Scene from './scene.js'

export default class SceneRenderer extends Renderer {

    isRenderTarget(view) {
        return view instanceof Scene
    }

    renderObject(ctx2d, view) {
        ctx2d.beginPath();
        ctx2d.lineWidth = 0;
        ctx2d.fillStyle = "rgba(128, 0, 0, 0.7)";
        ctx2d.rect(0, 0, view.width, view.height);
        ctx2d.fill();
    }

}
