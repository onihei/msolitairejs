import Renderer from './renderer.js'
import RoundRect from './round-rect.js'

export default class RoundRectRenderer extends Renderer {

    isRenderTarget(view) {
        return view instanceof RoundRect
    }

    renderObject(ctx2d, view) {
        let borderRadius = view.borderRadius;

        ctx2d.beginPath();
        ctx2d.moveTo(borderRadius, 0);
        ctx2d.lineTo(view.width - borderRadius, 0);
        ctx2d.quadraticCurveTo(view.width, 0, view.width, borderRadius);
        ctx2d.lineTo(view.width, view.height - borderRadius);
        ctx2d.quadraticCurveTo(view.width, view.height, view.width - borderRadius, view.height);
        ctx2d.lineTo(borderRadius, view.height);
        ctx2d.quadraticCurveTo(0, view.height, 0, view.height - borderRadius);
        ctx2d.lineTo(0, borderRadius);
        ctx2d.quadraticCurveTo(0, 0, borderRadius, 0);
        ctx2d.closePath();
        if (view.backgroundColor) {
            ctx2d.fillStyle = view.backgroundColor;
            ctx2d.fill();
        }
        if (view.borderColor) {
            ctx2d.strokeStyle = view.borderColor;
            ctx2d.lineWidth = view.borderWidth || 0;
            ctx2d.stroke();
        }
    }

}
