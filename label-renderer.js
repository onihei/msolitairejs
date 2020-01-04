import Renderer from './renderer.js'
import Label from './label.js'

export default class LabelRenderer extends Renderer {

    isRenderTarget(view) {
        return view instanceof Label
    }

    renderObject(ctx2d, view) {
        ctx2d.font = (view.fontSize || '20px') + " '" + view.fontFamily + "'";
        ctx2d.fillStyle = view.color;
        let x = 0, y = 0;
        ctx2d.textBaseline = view.textBaseline;
        switch (view.textBaseline) {
            case "middle":
                y = view.height / 2;
                break;
            case "bottom":
                y = view.height;
                break;
        }
        ctx2d.textAlign = view.textAlign;
        switch (view.textAlign) {
            case "center":
                x = view.width / 2;
                break;
            case "right":
                x = view.width;
                break;
        }
        ctx2d.fillText(view.text, x, y);
    }

}
