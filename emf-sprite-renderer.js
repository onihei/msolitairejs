import Renderer from './renderer.js'
import EmfSprite from './emf-sprite.js'

export default class EmfSpriteRenderer extends Renderer {

    isRenderTarget(view) {
        return view instanceof EmfSprite
    }

    renderObject(ctx2d, view) {
        // ctx2d.beginPath();
        // ctx2d.lineWidth = 0;
        // ctx2d.fillStyle = "rgba(128, 0, 0.3, 0.7)";
        // ctx2d.rect(0, 0, view.width, view.height);
        // ctx2d.fill();

        let scalex = view.width / view.emf.header.width;
        let scaley = view.height / view.emf.header.height;
        ctx2d.scale(scalex, scaley);

        EmfSpriteRenderer.renderEmf(ctx2d, view.emf);

    }

    static renderEmf(ctx2d, emf) {
        for (let i = 0; i < emf.emfOperations.length; i++) {
            let operation = emf.emfOperations[i];
            let iType = operation.iType;
            let data = operation.data;
            this.renderEmfOperation(ctx2d, iType, data);
        }
    }

    static renderEmfOperation(ctx2d, iType, data) {
        switch (iType) {
            case 90: // EMR_POLYPOLYLINE16
            case 91: // EMR_POLYPOLYGON16
            {
                ctx2d.save();
                ctx2d.beginPath();

                ctx2d.moveTo(data.pointList[0].x, data.pointList[0].y);
                for (let i = 1; i < data.pointList.length; i++) {
                    ctx2d.lineTo(data.pointList[i].x, data.pointList[i].y);
                }
                if (iType === 91) ctx2d.closePath();

                if (iType === 91 && data.brushStyle !== 1) { //!BS_NULL
                    ctx2d.fillStyle = data.brushColor;
                    ctx2d.fill();
                }
                if (data.penStyle !== 5) {// PS_NULL
                    ctx2d.strokeStyle = data.penColor;
                    ctx2d.lineWidth = data.penWidth;
                    ctx2d.lineCap = data.cap;
                    ctx2d.lineJoin = data.join;
                    ctx2d.lineMiter = data.miter;
                    ctx2d.stroke();
                }
                ctx2d.restore();
            }
                break;
            case 62: // EMR_FILLPATH
            case 63: // EMR_STROKEANDFILLPATH
            case 64: // EMR_STROKEPATH
            {
                if (iType !== 64 && data.brushStyle !== 1) { //!BS_NULL
                    ctx2d.fillStyle = data.brushColor;
                    ctx2d.fill();
                }
                if (data.penStyle !== 5) {//・￣S_NULL
                    ctx2d.strokeStyle = data.penColor;
                    ctx2d.lineWidth = data.penWidth;
                    ctx2d.lineCap = data.cap;
                    ctx2d.lineJoin = data.join;
                    ctx2d.lineMiter = data.miter;
                    ctx2d.stroke();
                }
            }
                break;
            case 59: // EMR_BEGINPATH
                ctx2d.beginPath();
                break;
            case 27: // EMR_MOVETOEX
                ctx2d.moveTo(data.x, data.y);
                break;
            case 61: // EMR_CLOSEFIGURE
                ctx2d.closePath();
                break;
            case 88: // EMR_POLYBEZIERTO16
            {
                for (let i = 0; i < data.pointList.length; i+=3) {
                    let pt1 = data.pointList[i];
                    let pt2 = data.pointList[i+1];
                    let pt3 = data.pointList[i+2];
                    ctx2d.bezierCurveTo(pt1.x, pt1.y, pt2.x, pt2.y, pt3.x, pt3.y);
                }
            }
                break;
            case 36: // EMR_MODIFYWORLDTRANSFORM
            {
                ctx2d.save();
                ctx2d.transform(
                    data.eM11,
                    data.eM12,
                    data.eM21,
                    data.eM22,
                    data.eDx,
                    data.eDy);
            }
                break;
            case 35: // EMR_SETWORLDTRANSFORM
                ctx2d.restore();
                break;
            case 81: // EMR_STRETCHDIBITS
                ctx2d.drawImage(data.image, 0, -data.image.height);
                break;
            default:
                console.log(iType);
                break;
        }
    }

}
