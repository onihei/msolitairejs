export default class Audio {

    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
        this.mute = false;
        this.gainNode.gain.value = .045;
        this.audioBufferPromiseMap = {};
        this.audioSourcePromiseMap = {};
    }

    resume() {
        this.context.resume();
    }

    load(id, arrayBuffer) {
        if (window.webkitAudioContext) {
            this.audioBufferPromiseMap[id] = new Promise((resolve, reject) => {
                this.context.decodeAudioData(arrayBuffer.slice(0), function (buf) {
                    resolve(buf);
                });
            });
        } else {
            this.audioBufferPromiseMap[id] = this.context.decodeAudioData(arrayBuffer.slice(0));
        }
    }

    play(id, loop = false) {
        const promise = this.audioBufferPromiseMap[id];
        if (promise) {
            this.audioSourcePromiseMap[id] = promise.then((audioBuffer) => {
                const source = this.context.createBufferSource();
                source.loop = loop;
                source.buffer = audioBuffer;
                source.connect(this.gainNode);
                source.start();
                return source;
            });
        }
    }

    stop(id) {
        if (id) {
            this.audioSourcePromiseMap[id].then((source) => {
                if (source instanceof AudioBufferSourceNode) {
                    source.stop();
                    delete this.audioSourcePromiseMap[id];
                }
            });
        } else {
            Object.keys(this.audioSourcePromiseMap).forEach(key=>{
                this.stop(key);
            });
        }
    }

    setMute(mute) {
        this.mute = mute;
        if (mute) {
            this.gainNode.gain.value = 0;
        } else {
            this.gainNode.gain.value = .045;
        }
    }

    isMute() {
        return this.mute;
    }
}
