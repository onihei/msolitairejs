
let engine = null;
export default class Engine {

    static init(width, height, density, canvas) {
        if (!canvas) {
            canvas = document.createElement('canvas');
            let body = document.getElementsByTagName('body')[0];
            body.insertBefore(canvas, document.body.firstChild);
            canvas.width = width * density;
            canvas.height = height * density;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }
        engine = new Engine(canvas, width, height, density);
    }

    constructor(canvas, width, height, density) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.density = density;
        this.ctx2d = canvas.getContext("2d");
        this.sceneMap = {};
        this.currentSceneName = null;
        this.renderer = null;
    }

    static addRenderer(renderer) {
        engine.addRenderer(renderer);
    }

    static async addScene(name, scene) {
        await engine.addScene(name, scene);
    }

    static setCurrentSceneName(sceneName) {
        engine.setCurrentSceneName(sceneName);
    }

    static render() {
        engine.render();
    }

    render() {
        this.canvas.width = this.canvas.width;
        this.ctx2d.save();
        this.ctx2d.font = "32px 'Roboto'";
//        this.ctx2d.translate(0.5, 0.5);
        this.ctx2d.scale(this.density, this.density);
        this.renderObjects(this.sceneMap[this.currentSceneName]);
        this.ctx2d.restore()
    }

    renderObjects(view) {
        if (!view.visible) {
            return;
        }
        this.ctx2d.save();
        view.onDraw(this.ctx2d);
        this.ctx2d.translate(view.left, view.top);
        // this.ctx2d.beginPath();
        // this.ctx2d.rect(0, 0, view.width, view.height);
        // this.ctx2d.clip();
        this.ctx2d.save();
        this.renderer.render(this.ctx2d, view);
        view.paint(this.ctx2d);
        this.renderChildren(view.children);
        this.ctx2d.restore();
        this.ctx2d.restore()
    }

    renderChildren(children) {
        children.sort((a, b) => {
            return a.order - b.order
        });
        for (let i = 0; i < children.length; i++) {
            this.renderObjects(children[i]);
        }
    }

    addRenderer(renderer) {
        if (this.renderer == null) {
            this.renderer = renderer;
        } else {
            this.renderer.add(renderer);
        }
    }

    async addScene(name, scene) {
        scene.width = this.width;
        scene.height = this.height;
        this.sceneMap[name] = scene;
        await scene.init();
    }

    async setCurrentSceneName(sceneName) {
        if (this.sceneMap[this.currentSceneName]) {
            this.sceneMap[this.currentSceneName].undelegateEvents(this.canvas);
            this.sceneMap[this.currentSceneName].onLeave();
        }
        this.currentSceneName = sceneName;
        this.sceneMap[sceneName].onEnter();
        this.sceneMap[sceneName].delegateEvents(this.canvas);
        this.render();
    }
}
