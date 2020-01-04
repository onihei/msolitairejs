
export default class Renderer {

    constructor() {
        this.next = null;
    }

    render(ctx2d, view) {
        if (this.isRenderTarget(view)) {
            this.renderObject(ctx2d, view)
        }
        if (this.next !== null) {
            this.next.render(ctx2d, view)
        }
    }

    renderObject(ctx2d, view) {}

    isRenderTarget(view) {
        return false
    }

    add(renderer) {
        let last = this._findLastRenderer(this);
        last.next = renderer;
    }

    _findLastRenderer(renderer) {
        while(renderer.next != null) {
            renderer = renderer.next;
        }
        return renderer;
    }
}
