import Renderer from './renderer.js'
import Sprite from './sprite.js'

export default class SpriteRenderer extends Renderer {

    isRenderTarget(view) {
        return view instanceof Sprite
    }

    renderObject(ctx2d, view) {
        // ctx2d.beginPath();
        // ctx2d.lineWidth = 0;
        // ctx2d.fillStyle = "rgba(128, 0, 0.3, 0.7)";
        // ctx2d.rect(0, 0, view.width, view.height);
        // ctx2d.fill();

        ctx2d.drawImage(view.image, 0, 0);
    }
}
