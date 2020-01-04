import EmfSpriteRenderer from './emf-sprite-renderer.js'
import Pai from './pai.js'
import Stage from './stage.js'

export default class PaiRenderer extends EmfSpriteRenderer {

    isRenderTarget(view) {
        return view instanceof Pai
    }

    renderObject(ctx2d, view) {
        // ctx2d.beginPath();
        // ctx2d.lineWidth = 0;
        // ctx2d.fillStyle = "rgba(128, 0.7, 0, 0.7)";
        // ctx2d.rect(0, 0, view.width, view.height);
        // ctx2d.fill();

        ctx2d.save();
        let shadowImage = Stage.shadowImage();
        ctx2d.translate(- view.width / 2, -view.height / 2);
        ctx2d.scale(view.width * 2 / shadowImage.width, view.height * 2 / shadowImage.height);
        ctx2d.drawImage(shadowImage, 0, 0);
        ctx2d.restore();

        ctx2d.save();
        ctx2d.scale(view.width / view.emf.header.width, view.height / view.emf.header.height);
        EmfSpriteRenderer.renderEmf(ctx2d, view.emf);
        ctx2d.restore();

        if (view.selected) {
            ctx2d.save();
            ctx2d.globalAlpha = 0.3;
            ctx2d.globalCompositeOperation = 'lighter';
            let scalex = view.width / view.emf.header.width;
            let scaley = view.height / view.emf.header.height;
            ctx2d.scale(scalex, scaley);
            EmfSpriteRenderer.renderEmf(ctx2d, Stage.markEmf());
            ctx2d.restore();
        }

    }

}
