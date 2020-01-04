
let assetsMap = {};
export default class Assets {

    static async loadImage(uri) {
        if (assetsMap[uri]) {
            return assetsMap[uri];
        }
        let response = await fetch(uri);
        if (!response.ok) {
            throw "load error";
        }

        let img = new Image();
        img.src = URL.createObjectURL(await response.blob());
        return new Promise((resolve, reject) => {
            img.onload = function () {
                assetsMap[uri] = img;
                resolve(assetsMap[uri]);
            };
        });
    }

    static async loadAudio(uri) {
        if (assetsMap[uri]) {
            return assetsMap[uri];
        }
        let response = await fetch(uri);
        if (!response.ok) {
            throw "load error";
        }
        assetsMap[uri] = await response.arrayBuffer();
        return assetsMap[uri];
    }

    static async loadRaw(uri) {
        if (assetsMap[uri]) {
            return assetsMap[uri];
        }
        let response = await fetch(uri);
        if (!response.ok) {
            throw "load error";
        }
        assetsMap[uri] = new Uint8Array(await response.arrayBuffer());
        return assetsMap[uri];
    }

    static async loadFont(fontFamily, uri) {
        if (assetsMap[uri]) {
            return assetsMap[uri];
        }
        if (!window.FontFace) {
            return null;
        }
        let font = new FontFace(fontFamily, 'url(' + uri +')');
        let f = await font.load();
        document.fonts.add(f);
        assetsMap[uri] = f;
        return assetsMap[uri];
    }
}
