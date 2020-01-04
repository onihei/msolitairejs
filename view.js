
export default class View {

    constructor(props = {}) {
        this.id = props.id || null;
        this.left = props.left || 0;
        this.top = props.top || 0;
        this.width = props.width || 100;
        this.height = props.height || 100;
        this.order = props.order || 0;
        this.visible = props.visible || true;
        this.children = [];
        this.clickFn = null;

        this.eventToHandlerMap = {
            "click": "handleClick"
        };
        if ('ontouchstart' in window) {
            this.eventToHandlerMap = {
                "touchend": "handleClick"
            };
        }

        this._listener = (event) => {
            let x = event.offsetX || event.layerX;
            let y = event.offsetY || event.layerY;
            if (event.touches !== undefined) {
                if (event.touches[0]) {
                    x = event.layerX;
                    y = event.layerY
                } else {
                    x = event.changedTouches[0].pageX;
                    y = event.changedTouches[0].pageY;
                }
            }
            let customEvent = {
                type: event.type,
                layerX: x,
                layerY: y,
                orgEvent: event
            };
            this._handleEvent(customEvent)
        };

    }

    onDraw(ctx2d) {

    }

    paint(ctx2d) {

    }

    addChild(view) {
        if (!(view instanceof View)) {
            throw "child is not View"
        }
        this.children.push(view)
    }

    removeChild(view) {
        if (!(view instanceof View)) {
            return;
        }
        for (let i in this.children) {
            if (this.children[i] === view) {
                view.parent = null;
                this.children.splice(i, 1);
                return;
            }
        }
    }

    delegateEvents(canvas) {
        for (let key in this.eventToHandlerMap) {
            canvas.addEventListener(key, this._listener)
        }
    }

    undelegateEvents(canvas) {
        for (let key in this.eventToHandlerMap) {
            canvas.removeEventListener(key, this._listener)
        }
    }

    _handleEvent(event) {
        if (!this.visible) {
            return;
        }
        if (View.ptInRect(event.layerX, event.layerY, 0, 0, this.width, this.height)) {
            let consumed = false;
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                let customEvent = {
                    type: event.type,
                    layerX: event.layerX - child.left,
                    layerY: event.layerY - child.top,
                    orgEvent: event.orgEvent
                };
                consumed = consumed || child._handleEvent(customEvent);
            }
            if (consumed) {
                return true;
            }
            let handlerName = this.eventToHandlerMap[event.type];
            if (handlerName) {
                return this[handlerName](event);
            }
        }
        return false;
    }

    setOnClickListener(fn) {
        this.clickFn = fn;
    }

    handleClick(event) {
        if (this.clickFn) {
            this.clickFn();
        }
    }

    static ptInRect(x, y, left, top, width, height) {
        if (x < left || x >= (left + width) || y < top || y > top + height) {
            return false
        }
        return true
    }
}
